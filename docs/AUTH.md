# Authentication Architecture

## Два приложения — два потока аутентификации

| Приложение | Guard | Токен | Стратегия |
|---|---|---|---|
| Мобильное (User) | `UserAuthGuard` | Firebase ID token | `user-firebase` |
| CMS (Worker) | `WorkerAuthGuard` | App JWT | `worker-jwt` |

---

## Passport Strategies

### UserFirebaseStrategy (`user-firebase`)

Файл: `src/modules/user/infrastructure/persistence/auth/user-firebase.strategy.ts`

- Использует `passport-custom`
- Инжектирует `FirebaseAuthAdapter` и проверяет Firebase ID-токен через Firebase Admin SDK
- `request.user` → `TDecodedIdToken` (Firebase payload: `uid`, `email`, `name`, ...)
- Зарегистрирована в `UserPersistenceModule`

### WorkerJwtStrategy (`worker-jwt`)

Файл: `src/modules/worker/infrastructure/persistence/auth/worker-jwt.strategy.ts`

- Использует `passport-jwt` + `ExtractJwt.fromAuthHeaderAsBearerToken()`
- Верифицирует app-issued JWT по `JWT_SECRET`
- `request.user` → `IWorkerJwtPayload { sub, email, role }`
- Зарегистрирована в `WorkerPersistenceModule`

---

## Guards

Расположены в `src/infrastructure/auth/guards/`:

| Guard | Назначение |
|---|---|
| `UserAuthGuard` | Мобильное приложение. Проверяет Firebase ID token |
| `WorkerAuthGuard` | CMS. Проверяет worker JWT |
| `WorkerRolesGuard` | Проверяет роль воркера по `@Roles(...)`. Всегда после `WorkerAuthGuard` |

---

## Decorators

Расположены в `src/infrastructure/auth/decorators/`:

| Декоратор | Тип | Описание |
|---|---|---|
| `@Roles(...roles)` | Metadata | Устанавливает требуемые роли (ключ `ROLES_KEY`) |
| `@CurrentUser()` | Param | Возвращает `TDecodedIdToken` из `request.user` |
| `@CurrentWorker()` | Param | Возвращает `IWorkerJwtPayload` из `request.user` |

---

## Роли воркера

```typescript
// src/modules/worker/domains/entities/worker.entity.ts
export enum WorkerRole {
    ADMIN = "admin",
    EDITOR = "editor",
}
```

---

## Примеры использования

```typescript
// Мобильное (Firebase token):
@UseGuards(UserAuthGuard)
@Get("profile")
getProfile(@CurrentUser() user: ICurrentUser) { ... }

// CMS — любой аутентифицированный воркер:
@UseGuards(WorkerAuthGuard)
@Get()
list() { ... }

// CMS — только admin:
@UseGuards(WorkerAuthGuard, WorkerRolesGuard)
@Roles(WorkerRole.ADMIN)
@Post()
create(@CurrentWorker() worker: IWorkerJwtPayload) { ... }

// CMS — admin или editor:
@UseGuards(WorkerAuthGuard, WorkerRolesGuard)
@Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
@Get(":id")
getOne(@CurrentWorker() worker: IWorkerJwtPayload) { ... }
```

---

## Shared JWT Module

Файл: `src/infrastructure/jwt/jwt.module.ts`

- `@Global()` — зарегистрирован в `AppModule`, доступен везде
- Регистрирует `JwtModule.register()` один раз
- Экспортирует `JwtAdapter` с методом `sign(payload: object): Promise<string>`
- Используется в обоих persistence-модулях

---

## Файловая структура

```
src/infrastructure/
├── auth/
│   ├── guards/
│   │   ├── user-auth.guard.ts
│   │   ├── worker-auth.guard.ts
│   │   └── worker-roles.guard.ts
│   └── decorators/
│       ├── roles.decorator.ts
│       ├── current-user.decorator.ts
│       └── current-worker.decorator.ts
└── jwt/
    ├── jwt.adapter.ts
    └── jwt.module.ts

src/modules/user/infrastructure/persistence/auth/
└── user-firebase.strategy.ts

src/modules/worker/infrastructure/persistence/auth/
└── worker-jwt.strategy.ts
```

---

## Необходимые пакеты

```bash
npm install @nestjs/passport passport passport-jwt passport-custom
npm install -D @types/passport-jwt
```

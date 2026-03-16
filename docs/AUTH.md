# Authentication Architecture

## Два приложения — два потока аутентификации

| Приложение | Guard | Токен в запросе | Стратегия |
|---|---|---|---|
| Мобильное (User) | `UserAuthGuard` | Firebase ID token в `Authorization: Bearer` | `user-firebase` |
| CMS (Worker) | `WorkerAuthGuard` | App JWT в `Authorization: Bearer` | `worker-jwt` |

---

## Worker Auth Flow (CMS)

```
POST /workers/auth/sign-in
  body: { email, password }
  ← body:  { accessToken, expiresIn }
  ← cookie: refresh_token (httpOnly, sameSite=strict, path=/workers/auth/refresh)

POST /workers/auth/refresh
  cookie: refresh_token  (отправляется браузером автоматически только на этот path)
  ← body: { accessToken, expiresIn }

POST /workers  (create worker, admin only)
  header: Authorization: Bearer <accessToken>
```

### Токены

| Токен | Тип | Хранение | Срок жизни |
|---|---|---|---|
| Access token | JWT (подписан `JWT_SECRET`) | Память JS | `JWT_EXPIRES_IN` (default `15m`) |
| Refresh token | JWT (подписан `JWT_SECRET`) | `httpOnly` cookie | `JWT_REFRESH_EXPIRES_IN` (default `7d`) |

**Cookie параметры refresh_token:**
- `httpOnly: true` — JS на фронте не может прочитать
- `secure: true` — только HTTPS (в production)
- `sameSite: strict` — защита от CSRF
- `path: /workers/auth/refresh` — браузер отправляет cookie только на этот путь

### Переменные окружения

```
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## User Auth Flow (Mobile)

```
POST /auth/firebase
  body: { idToken }   ← Firebase ID token из Firebase SDK
  ← body: { accessToken, refreshToken, expiresIn }

Последующие запросы:
  header: Authorization: Bearer <firebaseIdToken>
  (Firebase SDK сам обновляет токен на клиенте)
```

Гард `UserAuthGuard` проверяет Firebase ID token на каждый запрос через Firebase Admin SDK.

---

## Passport Strategies

### UserFirebaseStrategy (`user-firebase`)

Файл: `src/modules/user/infrastructure/persistence/auth/user-firebase.strategy.ts`

- Использует `passport-custom`
- Инжектирует `FirebaseAuthAdapter`, проверяет Firebase ID-токен через Firebase Admin SDK
- `request.user` → `TDecodedIdToken` (Firebase payload: `uid`, `email`, `name`, ...)
- Зарегистрирована в `UserPersistenceModule`

### WorkerJwtStrategy (`worker-jwt`)

Файл: `src/modules/worker/infrastructure/persistence/auth/worker-jwt.strategy.ts`

- Использует `passport-jwt` + `ExtractJwt.fromAuthHeaderAsBearerToken()`
- Верифицирует access JWT по `JWT_SECRET`
- `request.user` → `IWorkerJwtPayload { sub, email, role }`
- Зарегистрирована в `WorkerPersistenceModule`

---

## Guards

Расположены в `src/infrastructure/auth/guards/`:

| Guard | Назначение |
|---|---|
| `UserAuthGuard` | Мобильное приложение. Проверяет Firebase ID token |
| `WorkerAuthGuard` | CMS. Проверяет worker access JWT |
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

## Примеры использования в контроллерах

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
- Экспортирует `JwtAdapter` с методами:
  - `sign(payload: object): Promise<string>` — access token (`JWT_EXPIRES_IN`)
  - `signRefresh(payload: object): Promise<string>` — refresh token (`JWT_REFRESH_EXPIRES_IN`)
  - `verifyRefresh(token: string): Promise<Record<string, unknown>>` — верификация refresh

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

src/modules/worker/domains/ports/in/
├── i-worker.use-cases.ts      # IWorkerTokens, IWorkerAccessToken, IWorkerUseCases
├── sign-in.command.ts
├── refresh-token.command.ts
└── create-worker.command.ts

src/modules/worker/infrastructure/api/
├── worker-api.controller.ts   # sign-in (cookie), refresh, create
└── dto/
    └── worker-auth.response.ts  # { accessToken, expiresIn } — без refreshToken
```

---

## Необходимые пакеты

```bash
npm install @nestjs/passport passport passport-jwt passport-custom cookie-parser
npm install -D @types/passport-jwt @types/cookie-parser
```

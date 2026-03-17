# Architecture

## Обзор

NestJS backend для klang-cms, построенный по принципам **Hexagonal Architecture** (Ports & Adapters).

Один domain-слой — независимый и framework-agnostic. Два типа адаптеров (API и Persistence) подключаются к нему через порты.

```
┌─────────────────────────────────────────────────┐
│                   src/modules/                  │
│                                                 │
│  ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│  │  API     │   │  Domain  │   │ Persistence│  │
│  │ adapter  │──▶│  (core)  │◀──│  adapter   │  │
│  └──────────┘   └──────────┘   └────────────┘  │
└─────────────────────────────────────────────────┘

src/infrastructure/   ← shared: auth guards, JWT, ORM relation decorators
```

---

## Структура модуля

Каждый модуль (например, `lesson`, `user`, `worker`) следует одной схеме:

```
src/modules/{module}/
├── domains/                        # Domain layer — чистая бизнес-логика
│   ├── entities/                   # *.entity.ts — domain entities
│   ├── ports/
│   │   ├── in/                     # Inbound ports: use-cases, commands
│   │   └── out/                    # Outbound ports: i-*-repository.port.ts
│   └── services/                   # Use-case implementations
└── infrastructure/
    ├── api/                        # API adapters (NestJS controllers, DTOs)
    │   ├── dto/
    │   ├── *-api.module.ts
    │   └── *-api.controller.ts
    └── persistence/                # Persistence adapters (TypeORM)
        ├── {entity}/               # *.orm-entity.ts
        ├── *-repository.adapter.ts
        └── *-persistence.module.ts

src/infrastructure/                 # Shared infrastructure (cross-module)
├── auth/
│   ├── guards/                     # UserAuthGuard, WorkerAuthGuard, WorkerRolesGuard
│   └── decorators/                 # @Roles, @CurrentUser, @CurrentWorker
├── jwt/                            # JwtAdapter, JwtModule (@Global)
└── relations/                      # Cross-module ORM relation decorators
```

---

## Правила зависимостей

**Зависимости текут ВНУТРЬ.** Domain ничего не знает о внешних слоях.

```
API adapter  →  Domain (ports/entities/services)  ←  Persistence adapter
```

| Слой | Разрешённые импорты | Запрещённые импорты |
|---|---|---|
| `domains/entities/` | другие domain entities, domain ports | `*.orm-entity.ts`, NestJS, TypeORM |
| `domains/ports/out/` | domain entities | `*.orm-entity.ts` |
| `domains/services/` | domain entities, domain ports | `*.orm-entity.ts` |
| `infrastructure/persistence/` | domain entities + ORM entities | — |

---

## Маппинг данных

**Domain entities НЕ импортируют ORM entities.** Маппинг — исключительно в persistence-адаптере.

### Паттерн `mapToDomain()`

Метод живёт на domain entity и принимает plain-data интерфейс:

```typescript
// page.entity.ts
export interface IPageData { id: string; text: string; order: number; lessonId: string; }

export class PageEntity {
    static mapToDomain(data: IPageData | null): PageEntity | null { ... }
}
```

### Паттерн адаптера

```typescript
// lesson-persistence.adapter.ts
private getLessonOrm(id: string): Promise<LessonOrmEntity | null> { ... }  // internal

async getLesson(id: string): Promise<LessonEntity | null> {                 // port method
    const orm = await this.getLessonOrm(id);
    return LessonEntity.mapToDomain(orm);                                   // mapping here
}
```

### Data flow

```
HTTP Request
  → Controller
    → Command / Query
      → Service (uses domain port)
        → Repository Adapter
          → ORM Entity (TypeORM)
          ← ORM Entity
        ← Domain Entity (mapToDomain)
      ← Domain Entity
    ← Domain Entity
  → Response DTO (mapToResponse)
← HTTP Response
```

Plain-data интерфейсы (`IPageData`, `ILessonData`, `ISectionData`, `IUserData`) живут в `domains/entities/`.

---

## Cross-Module ORM Relations

**`*.orm-entity.ts` НЕ импортирует `*.orm-entity.ts` из другого модуля.**

| Тип отношения | Где объявлять | Как |
|---|---|---|
| Внутри модуля | В самом `*.orm-entity.ts` | Стандартные TypeORM декораторы |
| Между модулями | `src/infrastructure/relations/*.decorator.ts` | Кастомный декоратор |

```typescript
// ✅ Внутри модуля — напрямую
@OneToMany(() => PageOrmEntity, (page) => page.lesson)
pages: PageOrmEntity[];

// ✅ Между модулями — через декоратор
// infrastructure/relations/user-relation.decorator.ts
export function UserRelation(): PropertyDecorator {
    return (target, propertyKey) => {
        ManyToOne(() => UserOrmEntity, { nullable: false })(target, propertyKey as string);
        JoinColumn({ name: "user_id" })(target, propertyKey as string);
    };
}

// user-progress.orm-entity.ts
import { UserRelation } from "@infrastructure/relations/user-relation.decorator";
@UserRelation()
userId: string;
```

---

## API Architecture

Два типа потребителей — два набора API-адаптеров. Один domain-слой.

```
Domain (неизменен)
    ↑               ↑
LessonCmsController  LessonMobileController
@Controller("cms")   @Controller("mob")
WorkerAuthGuard      UserAuthGuard
```

### Префиксы маршрутов

| Префикс | Аудитория | Guard |
|---|---|---|
| `/cms/*` | CMS (workers) | `WorkerAuthGuard` + `WorkerRolesGuard` |
| `/mob/*` | Mobile (users) | `UserAuthGuard` |

### Swagger

| URL | Аудитория | Теги |
|---|---|---|
| `/api/cms` | CMS workers | `CMS / Workers`, `CMS` |
| `/api/mobile` | Mobile users | `Mobile / Auth`, `Mobile` |

Подробнее — [API.md](API.md), [AUTH.md](AUTH.md#swagger).

---

## Authentication

Два независимых потока аутентификации:

| Приложение | Guard | Токен | Стратегия |
|---|---|---|---|
| Mobile (User) | `UserAuthGuard` | Firebase ID token (`Authorization: Bearer`) | `user-firebase` |
| CMS (Worker) | `WorkerAuthGuard` | App JWT (`Authorization: Bearer`) | `worker-jwt` |

### Worker Auth

```
POST /cms/workers/auth/sign-in   → { accessToken } + cookie: refresh_token (httpOnly)
POST /cms/workers/auth/refresh   → { accessToken }
```

### User Auth (Mobile)

Нет отдельного sign-in эндпоинта. Клиент аутентифицируется напрямую через Firebase SDK, передаёт Firebase ID token в каждом запросе. `UserAuthGuard` проверяет его через Firebase Admin SDK.

### WorkerRole

```typescript
export enum WorkerRole { ADMIN = "admin", EDITOR = "editor" }
```

Подробнее — [AUTH.md](AUTH.md).

---

## Import Conventions

| Алиас | Резолвится в | Применение |
|---|---|---|
| `@infrastructure/*` | `src/infrastructure/*` | Shared infra (guards, JWT, relation decorators) |
| `@modules/*` | `src/modules/*` | Cross-module ссылки |

```typescript
// ✅ Cross-boundary: алиасы
import { WorkerAuthGuard } from "@infrastructure/auth/guards/worker-auth.guard";
import { WorkerRole } from "@modules/worker/domains/entities/worker.entity";

// ✅ Внутри модуля: относительные пути
import { LessonEntity } from "../../entities/lesson.entity";

// ❌ Нельзя: глубокий relative cross-boundary
import { WorkerRole } from "../../../../worker/domains/entities/worker.entity";
```

Подробнее — [IMPORTS.md](IMPORTS.md).

---

## Modules

| Модуль | Назначение |
|---|---|
| `lesson` | Контент: Section → Lesson → Page, user-progress |
| `user` | Mobile-пользователи (Firebase auth) |
| `worker` | CMS-пользователи (email/password, JWT, роли) |

### Shared Infrastructure

| Путь | Содержимое |
|---|---|
| `src/infrastructure/auth/guards/` | `UserAuthGuard`, `WorkerAuthGuard`, `WorkerRolesGuard` |
| `src/infrastructure/auth/decorators/` | `@Roles`, `@CurrentUser`, `@CurrentWorker` |
| `src/infrastructure/jwt/` | `JwtModule` (@Global), `JwtAdapter` |
| `src/infrastructure/relations/` | Кастомные ORM relation decorators |

---

## Naming Conventions

| Артефакт | Шаблон |
|---|---|
| Файлы | `kebab-case` |
| Классы | `PascalCase` |
| Domain entity | `*.entity.ts` |
| ORM entity | `*.orm-entity.ts` |
| Repository adapter | `*-repository.adapter.ts` |
| Port interface | `i-*.port.ts` |
| DTO | `*.request.ts` / `*.response.ts` |

---

## Links

- [AUTH.md](AUTH.md) — детали аутентификации, стратегии, guards, примеры
- [API.md](API.md) — эндпоинты, структура lesson API, Swagger теги
- [IMPORTS.md](IMPORTS.md) — path aliases, правила импортов, runtime/build setup

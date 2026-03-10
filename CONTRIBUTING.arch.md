## RULES

### Именование файлов
- `kebab-case` для файлов
- `PascalCase` для классов
- `*.entity.ts` — domain entities
- `*.orm-entity.ts` — ORM-сущности (persistence layer)
- `*-repository.adapter.ts` — реализация out-порта
- `i-*.port.ts` — интерфейс/порт в domain layer
- `*.dto.ts` — api dtos

---

## Главное правило архитектуры

**Зависимости текут только внутрь.**

```
Controller (API) ──→ Domain ←── Adapter (Persistence)
```

Domain-слой **ничего не знает** о NestJS, TypeORM, HTTP и базах данных.

---

## Структура модуля

```
src/{module}/
├── domains/                  ← DOMAIN (только бизнес-логика)
│   ├── entities/             ← чистые объекты с геттерами + plain-data интерфейсы
│   ├── ports/in/             ← команды + интерфейсы use-cases
│   ├── ports/out/            ← интерфейсы репозиториев (i-*.port.ts)
│   └── services/             ← реализация use-cases
└── infrastructure/
    ├── api/                  ← контроллеры, DTO (NestJS, Swagger)
    └── persistence/          ← ORM-сущности, адаптеры (TypeORM)
```

---

## Правила по слоям

### Domain entities (`domains/entities/*.entity.ts`)

Не импортируют ORM-сущности, NestJS или TypeORM.

`mapToDomain()` принимает **plain-data интерфейс**, объявленный в том же файле:

```typescript
// ✅ Правильно
export interface IPageData {
    id: string;
    text: string;
    order: number;
}

export class PageEntity {
    static mapToDomain(data: IPageData | null): PageEntity | null { ... }
}
```

```typescript
// ❌ Неправильно — ORM-импорт в domain
import { PageOrmEntity } from "../../infrastructure/persistence/...";
static mapToDomain(orm: PageOrmEntity | null): PageEntity | null { ... }
```

---

### Out-порты (`domains/ports/out/i-*.port.ts`)

Возвращают **domain entities**, не ORM-сущности. Не импортируют `*.orm-entity.ts`.

```typescript
// ✅ Правильно
import { SectionEntity } from "../../entities/section.entity";

export interface ILessonCrudPorts {
    getSection(id: string): Promise<SectionEntity | null>;
}
```

```typescript
// ❌ Неправильно — ORM в порте
import { SectionOrmEntity } from "../../../infrastructure/...";
export interface ILessonCrudPorts {
    getSection(id: string): Promise<SectionOrmEntity | null>;
}
```

---

### Domain services (`domains/services/*.service.ts`)

Не импортируют `*.orm-entity.ts`. Работают только с domain entities и командами.

---

### Persistence adapters (`infrastructure/persistence/*-repository.adapter.ts`)

Реализуют out-порт. Работают с ORM внутри, но **публичные методы возвращают domain entities**.
Маппинг из ORM → domain делается здесь через `mapToDomain()`.

```typescript
// ✅ Правильно — маппинг в адаптере, приватный метод для ORM
export class LessonPersistenceAdapter implements ILessonCrudPorts {
    private getLessonOrm(id: string): Promise<LessonOrmEntity | null> {
        return this._repo.findOne({ where: { id }, relations: ["pages"] });
    }

    async getLesson(id: string): Promise<LessonEntity | null> {
        const orm = await this.getLessonOrm(id);
        return LessonEntity.mapToDomain(orm); // маппинг здесь
    }
}
```

---

### Cross-module ORM relations (`src/infrastructure/relations/`)

ORM-сущности **не импортируют** ORM-сущности из других модулей.

| Связь | Как делать |
|---|---|
| Внутри одного модуля | Стандартные TypeORM декораторы (`@ManyToOne`, `@OneToMany`) |
| Между разными модулями | Кастомный декоратор в `src/infrastructure/relations/*.decorator.ts` |

```typescript
// ✅ Правильно — кросс-модульная связь через декоратор
import { UserRelation } from "../../../../../infrastructure/relations/user-relation.decorator";

@UserRelation()
userId: string;
```

```typescript
// ❌ Неправильно — прямой импорт чужого ORM-entity
import { UserOrmEntity } from "../../user/infrastructure/persistence/...";
```

---

## Поток данных (полный цикл)

```
HTTP Request
    ↓
Controller → DTO → Command
    ↓
Use-case service (бизнес-логика, только domain entities)
    ↓
Out-port interface → Persistence adapter (SQL)
    ↓
ORM entity ──mapToDomain()──→ Domain entity   ← маппинг ТОЛЬКО здесь
    ↓
Сервис получает domain entity
    ↓
Controller → mapToResponse() → Response DTO
    ↓
HTTP Response
```

---

## Чек-лист перед коммитом

- [ ] Domain entity не импортирует `*.orm-entity.ts`
- [ ] `mapToDomain()` принимает `IXxxData` интерфейс, не ORM-тип
- [ ] Out-порт возвращает domain entity, не ORM-тип
- [ ] Domain service не импортирует `*.orm-entity.ts`
- [ ] Маппинг ORM → domain сделан в адаптере
- [ ] Кросс-модульные ORM-связи через `src/infrastructure/relations/`
- [ ] `npm run arch:validate` — без ошибок
- [ ] `npx tsc --noEmit` — без ошибок
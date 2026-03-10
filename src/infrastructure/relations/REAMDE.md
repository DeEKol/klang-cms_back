# Infrastructure Relations

## Правило: Low Coupling между модулями

Связи между ORM-сущностями **разных модулей** объявляются только здесь — через кастомные декораторы.

**Запрещено** импортировать ORM-entity одного модуля в другой:
```
// ❌ нельзя
import { UserOrmEntity } from "../../user/infrastructure/persistence/user/user.orm-entity";
```

**Нужно** создать декоратор в `src/infrastructure/relations/` и использовать его в entity:
```typescript
// ✅ в user-progress.orm-entity.ts
import { UserRelation } from "../../../../../infrastructure/relations/user-relation.decorator";

@UserRelation()
userId: string;
```

Декоратор инкапсулирует ссылку на чужой ORM-entity и экспортирует только поведение.

---

## Правило: High Cohesion внутри модуля

Связи между ORM-сущностями **одного модуля** объявляются стандартными TypeORM-декораторами прямо в entity-файле:

```typescript
// ✅ внутри модуля lesson — lesson.orm-entity.ts
import { PageOrmEntity } from "../lesson-page/page.orm-entity";

@OneToMany(() => PageOrmEntity, (page) => page.lesson)
pages: PageOrmEntity[];
```

---

## Итого

| Ситуация | Где объявить | Как |
|---|---|---|
| Связь внутри модуля | В самом `*.orm-entity.ts` | Стандартные TypeORM-декораторы |
| Связь между модулями | `src/infrastructure/relations/*.decorator.ts` | Кастомный декоратор |

> Цель: ни один `*.orm-entity.ts` не импортирует `*.orm-entity.ts` из другого модуля.

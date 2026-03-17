# Import Conventions

## Path Aliases

Two TypeScript path aliases are configured in `tsconfig.json`:

| Alias | Resolves to | Use for |
|---|---|---|
| `@infrastructure/*` | `src/infrastructure/*` | Shared infra (auth guards, JWT, relations) |
| `@modules/*` | `src/modules/*` | Cross-module references |

## Rules

### Use aliases for cross-boundary imports

```
src/infrastructure/  ←→  src/modules/
src/modules/foo/     ←→  src/modules/bar/
```

These crossings **must** use aliases, not relative paths.

### Use relative imports within the same module

Everything inside `src/modules/foo/` uses relative `./` or `../` paths.
Everything inside `src/infrastructure/foo/` uses relative paths within `src/infrastructure/`.

## Examples

```typescript
// ✅ Cross-module: absolute alias
import { WorkerRole } from "@modules/worker/domains/entities/worker.entity";
import { WorkerAuthGuard } from "@infrastructure/auth/guards/worker-auth.guard";
import { UserRelation } from "@infrastructure/relations/user-relation.decorator";

// ✅ Within-module: relative path
import { LessonEntity } from "../../entities/lesson.entity";
import { ILessonCrudPort } from "../ports/out/i-lesson-crud.port";

// ❌ Never: deep relative cross-boundary
import { WorkerRole } from "../../../../worker/domains/entities/worker.entity";
import { WorkerAuthGuard } from "../../../../../infrastructure/auth/guards/worker-auth.guard";
```

## Runtime and Build Support

| Context | Tool | Config |
|---|---|---|
| `ts-node` dev | `tsconfig-paths/register` | `-r tsconfig-paths/register` in scripts |
| Production build | `tsc-alias` | `tsc && tsc-alias` post-processes `dist/` |

Both packages are in `devDependencies`.

### Scripts that use `tsconfig-paths`:

```json
"start:dev": "ts-node -r tsconfig-paths/register src/main.ts",
"typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/data-source.ts",
"migration:create": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create"
```

### Production build:

```json
"build:prod": "tsc && tsc-alias"
```

`tsc-alias` rewrites alias strings in the emitted JS in `dist/` so that `node dist/main.js` works without any additional runtime resolver.

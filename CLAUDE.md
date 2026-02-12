# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a NestJS backend for klang-cms using **Hexagonal Architecture** (Ports & Adapters pattern). The codebase is organized into feature modules, each following a strict layered structure.

### Module Structure

Each module (e.g., `src/auth`, `src/lesson`) follows this directory layout:

```
src/{module}/
├── domains/                    # Business logic layer (framework-agnostic)
│   ├── entities/              # Domain entities (*.entity.ts)
│   ├── ports/
│   │   ├── in/               # Inbound ports (use cases, commands)
│   │   └── out/              # Outbound ports (repository interfaces: i-*.port.ts)
│   └── services/             # Domain services (use cases)
├── modules/
│   ├── api/                  # API layer (NestJS controllers, DTOs)
│   │   ├── dto/             # Data transfer objects (*.dto.ts)
│   │   ├── *-api.module.ts
│   │   └── *-api.controller.ts
│   └── persistence/          # Data access layer (adapters)
│       ├── {entity}/        # ORM entities folder (*.orm-entity.ts)
│       ├── *-repository.adapter.ts
│       └── *-persistence.module.ts
└── tests/                    # Module-specific tests
```

### Key Architectural Principles

1. **Dependency Rule**: Dependencies flow inward. Domain layer has NO dependencies on outer layers (modules/api, modules/persistence)
2. **Domain Entities** (`*.entity.ts`): Pure business objects with business logic, often use private fields with getters
3. **ORM Entities** (`*.orm-entity.ts`): Framework-specific persistence models (TypeORM)
4. **Ports**: Interfaces defining contracts between layers
   - **In Ports**: Use cases/commands that the domain exposes
   - **Out Ports**: Repository interfaces (prefixed with `i-`, e.g., `i-user-repository.port.ts`)
5. **Adapters**: Implementations of out ports (e.g., `*-repository.adapter.ts`)
6. **Mapping**: Domain entities have static `mapToDomain()` methods to convert from ORM entities

## Code Generation with Plop

**CRITICAL**: Always use Plop generators for creating new modules and entities. This ensures architectural consistency.

### Commands

```bash
# Create complete module scaffold (domains, modules/api, modules/persistence, tests)
npm run gen:module

# Create entity with domain/ports/dto/service/persistence/controller/tests
npm run gen:entity
```

### What Plop Generates

When running `npm run gen:entity`, it generates **18 files** for a complete CRUD module:

#### Domain Layer (8 files)
1. Domain entity with `mapToDomain()` (`domains/entities/{entity}.entity.ts`)
2. Create command (`domains/ports/in/create-{entity}.command.ts`)
3. Update command (`domains/ports/in/update-{entity}.command.ts`)
4. Delete command (`domains/ports/in/delete-{entity}.command.ts`)
5. Get command (`domains/ports/in/get-{entity}.command.ts`)
6. Use-cases interface with Symbol for DI (`domains/ports/in/i-{entity}.use-cases.ts`)
7. Repository port interface (`domains/ports/out/i-{entity}-repository.port.ts`)
8. CRUD service (`domains/services/{entity}-crud.service.ts`)

#### API Layer (6 files)
9. Create request DTO (`modules/api/dto/{entity}.request.ts`)
10. Update request DTO (`modules/api/dto/{entity}-update.request.ts`)
11. Delete request DTO (`modules/api/dto/{entity}-delete.request.ts`)
12. Find request DTO (`modules/api/dto/{entity}-find.request.ts`)
13. Response DTO with `mapToResponse()` (`modules/api/dto/{entity}.response.ts`)
14. CRUD controller with 4 endpoints (`modules/api/{entity}.controller.ts`)

#### Persistence Layer (2 files)
15. ORM entity (`modules/persistence/{entity}/{entity}.orm-entity.ts`)
16. Repository adapter (`modules/persistence/{entity}-repository.adapter.ts`)

#### Tests (1 file)
17. Test skeleton (`tests/{entity}.spec.ts`)

#### Module Update
18. Creates or updates persistence module with provider registration comment

### Important Notes on Code Generation

- Plop uses Handlebars templates from `plop-templates/`
- Generated files include `// CLAUDE:` comments marking areas needing implementation
- The generator creates a **complete CRUD scaffold** similar to the lesson module
- After generation, manually:
  1. **Add TypeORM decorators** to ORM entity (`@Entity`, `@Column`, `@PrimaryGeneratedColumn`)
  2. **Register repository adapter** in persistence module providers
  3. **Register CRUD service** in persistence module (provide Symbol, export Symbol)
  4. **Register controller** in API module controllers array
  5. **Add class-validator decorators** to DTOs (`@IsString`, `@IsEmail`, etc.)
  6. **Implement additional business logic** in service if needed beyond basic CRUD

See [PLOP_TEMPLATES_GUIDE.md](PLOP_TEMPLATES_GUIDE.md) for detailed template documentation.

## Naming Conventions (from CONTRIBUTING.arch.md)

- **Files**: `kebab-case`
- **Classes**: `PascalCase`
- **Domain entities**: `*.entity.ts`
- **ORM entities**: `*.orm-entity.ts`
- **Repository adapters**: `*-repository.adapter.ts`
- **Ports (interfaces)**: `i-*.port.ts`
- **DTOs**: `*.dto.ts`

## Development Commands

```bash
# Install dependencies
npm i

# Run migrations
npm run migration:run

# Development (separate terminals)
npm run build:dev    # Watch mode TypeScript compilation
npm run start:dev    # Start dev server

# Production build
npm run build:prod
npm run start:prod

# Database migrations
npm run migration:generate src/migrations/name
npm run migration:create src/migrations/name
npm run migration:revert
npm run schema:sync  # Sync schema (use cautiously)

# Architecture validation (checks naming conventions and module structure)
npm run arch:validate

# API Documentation
# Swagger UI: http://localhost:3000/api
# Swagger JSON: http://localhost:3000/api-json
```

## Code Style & Formatting

The project uses ESLint + Prettier with the following rules:

- **Quotes**: Double quotes
- **Semicolons**: Required
- **Tab width**: 4 spaces
- **Print width**: 100 characters
- **Trailing commas**: Always
- **Arrow function parens**: Always

Configuration is in [.eslintrc.js](.eslintrc.js).

Migrations are ignored by ESLint (see `ignorePatterns`).

## Technology Stack

- **Framework**: NestJS 10.x
- **Runtime**: Node.js with TypeScript 5.6
- **ORM**: TypeORM 0.3
- **Database**: SQLite (development)
- **Authentication**: Firebase Admin SDK, NestJS JWT
- **Validation**: class-validator
- **API Docs**: NestJS Swagger

## Working with This Codebase

### When Adding a New Feature

1. Determine which module it belongs to (or create new module with `npm run gen:module`)
2. Use `npm run gen:entity` to scaffold entity infrastructure
3. Implement domain logic in `domains/services/`
4. Add TypeORM decorators to ORM entity in `modules/persistence/{entity}/`
5. Wire up dependencies in module files (`*-api.module.ts`, `*-persistence.module.ts`)
6. Add validation decorators to DTOs using class-validator
7. Update Swagger decorators in controllers

### When Modifying Plop Templates

- Templates are in `plop-templates/` directory
- Ensure generated code follows ESLint/Prettier rules (double quotes, semicolons, 4-space indent)
- Test generation with `npm run gen:entity` after template changes
- Plop helpers available: `pascalCase`, `kebabCase`, `upperCase`, `eq`

### Architecture Validation

Run `npm run arch:validate` before committing to ensure:
- Port files are named `i-*.port.ts` (singular, not `.ports.ts`)
- Entity files are named `*.entity.ts`
- ORM entities are named `*.orm-entity.ts`
- Modules follow hexagonal architecture structure

The validation script is in [scripts/validate-architecture.js](scripts/validate-architecture.js).

### Database Changes

- Always create migrations (do not rely on `schema:sync` in production)
- Migration commands use TypeORM CLI with data source from `src/data-source.ts`

### Module Registration

When adding new controllers/providers:
- Controllers go in `{module}/modules/api/*-api.module.ts`
- Persistence adapters go in `{module}/modules/persistence/*-persistence.module.ts`
- Persistence modules are typically marked `@Global()` for repository DI

## Testing Strategy

Test files go in `src/{module}/tests/`. The plop generator creates test skeletons (`{entity}.spec.ts`).

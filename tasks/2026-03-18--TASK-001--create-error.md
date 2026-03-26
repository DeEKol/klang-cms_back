---
title: "Сделать обработчик ошибок и исключений"
assignee: "ai-agent"
status: "closed"
priority: "high"
labels: ["back", "controllers", "infrastructure"]
created_at: 2026-03-18
created_by: "dekolodkin"
closed_at: 2026-03-26
---

## Описание

- error и exception разные сущности
- errors обрабатывать через монады
- exceptions обрабатывать средствами nestjs

## Критерии готовности (DoD)

- [x] `Result<T, E>` монада (`src/infrastructure/result/result.ts`)
- [x] `DomainError` классы без зависимости от NestJS (`src/infrastructure/errors/domain-errors.ts`)
- [x] `DomainErrorMapper` — конвертация в `HttpException` (`src/infrastructure/errors/domain-error.mapper.ts`)
- [x] `GlobalExceptionFilter` — единый формат `{ statusCode, error, message }` (`src/infrastructure/filters/global-exception.filter.ts`)
- [x] Domain-сервисы возвращают `Result`, не бросают NestJS-исключения
- [x] Контроллеры читают `result.ok`, бросают через `DomainErrorMapper`
- [x] Фильтр зарегистрирован глобально в `main.ts`
- [x] `tsc --noEmit` проходит без ошибок
- [x] Задокументировано в `docs/THROWABLE.md`

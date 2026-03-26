# Error & Exception Handling

## Принцип

**Error** и **Exception** — разные сущности:

| Понятие | Что это | Как обрабатывается |
|---|---|---|
| **DomainError** | Предсказуемый исход бизнес-логики (не найдено, конфликт, неверные данные) | Монада `Result<T, E>` |
| **Exception** | Неожиданная ситуация (ошибка инфраструктуры, баг) | `throw` + `GlobalExceptionFilter` |

Domain-слой не бросает HTTP-исключения. Контроллер преобразует `DomainError` в `HttpException` через `DomainErrorMapper`.

---

## Файловая структура

```
src/infrastructure/
├── result/
│   └── result.ts                  ← монада Result<T, E>
├── errors/
│   ├── domain-errors.ts           ← DomainError + конкретные классы ошибок
│   └── domain-error.mapper.ts     ← DomainError → HttpException
└── filters/
    └── global-exception.filter.ts ← @Catch(*) — единый формат ответа на исключения
```

---

## Result монада

Файл: [src/infrastructure/result/result.ts](../src/infrastructure/result/result.ts)

```typescript
export type Result<T, E> = Ok<T> | Err<E>;

Result.ok(value)   // → Ok<T>   { ok: true,  value }
Result.err(error)  // → Err<E>  { ok: false, error }
```

Использование в сервисе:

```typescript
async signIn(command: SignInCommand): Promise<Result<IWorkerTokens, UnauthorizedError>> {
    const worker = await this.workerRepository.findByEmail(command.email);

    if (!worker) return Result.err(new UnauthorizedError("Invalid credentials"));

    // ...
    return Result.ok({ accessToken, refreshToken, expiresIn });
}
```

Использование в контроллере:

```typescript
const result = await this.workerUseCases.signIn(command);

if (!result.ok) throw DomainErrorMapper.toHttpException(result.error);

return WorkerAuthResponse.mapToResponse(result.value);
```

---

## DomainError

Файл: [src/infrastructure/errors/domain-errors.ts](../src/infrastructure/errors/domain-errors.ts)

```typescript
abstract class DomainError { kind: string; message: string; }

NotFoundError    // kind = "NotFound"
ConflictError    // kind = "Conflict"
UnauthorizedError// kind = "Unauthorized"
ForbiddenError   // kind = "Forbidden"
ValidationError  // kind = "Validation"
```

`DomainError` живёт в `@infrastructure/errors/` и **не зависит от NestJS**.
Domain-сервисы импортируют его через alias `@infrastructure/errors/domain-errors`.

---

## DomainErrorMapper

Файл: [src/infrastructure/errors/domain-error.mapper.ts](../src/infrastructure/errors/domain-error.mapper.ts)

Переводит `DomainError` в NestJS `HttpException`:

| DomainError | HttpException | HTTP статус |
|---|---|---|
| `NotFoundError` | `NotFoundException` | 404 |
| `ConflictError` | `ConflictException` | 409 |
| `UnauthorizedError` | `UnauthorizedException` | 401 |
| `ForbiddenError` | `ForbiddenException` | 403 |
| `ValidationError` | `BadRequestException` | 400 |
| любой другой | `HttpException` | 500 |

```typescript
if (!result.ok) throw DomainErrorMapper.toHttpException(result.error);
```

---

## GlobalExceptionFilter

Файл: [src/infrastructure/filters/global-exception.filter.ts](../src/infrastructure/filters/global-exception.filter.ts)

Зарегистрирован глобально в `main.ts`:

```typescript
app.useGlobalFilters(new GlobalExceptionFilter());
```

Ловит **все** исключения (`@Catch()`). Возвращает единый формат ответа:

```json
{
  "statusCode": 404,
  "error": "NotFound",
  "message": "Section abc not found"
}
```

Неожиданные исключения (не `HttpException`) → 500, логируются через `Logger`.

---

## Правила использования

### Domain-сервис
- Возвращает `Result.ok(value)` при успехе
- Возвращает `Result.err(new XxxError(...))` при предсказуемой ошибке
- **Никогда** не бросает NestJS-исключения (`NotFoundException`, `ConflictException` и т.д.)
- **Никогда** не импортирует `@nestjs/common` ради исключений

### Контроллер
- Получает `Result`, проверяет `result.ok`
- При `!result.ok` — `throw DomainErrorMapper.toHttpException(result.error)`
- При `result.ok` — работает с `result.value`

### Когда использовать `throw` напрямую
Только для неожиданных исключений (не domain-ошибок), например при отсутствии куки refresh-токена в запросе:
```typescript
if (!refreshToken) throw new UnauthorizedException("Refresh token not found");
```

---

## Добавить новый тип ошибки

1. Добавить класс в `domain-errors.ts`:
   ```typescript
   export class RateLimitError extends DomainError {
       readonly kind = "RateLimit" as const;
   }
   ```

2. Добавить маппинг в `domain-error.mapper.ts`:
   ```typescript
   if (error instanceof RateLimitError) return new HttpException(error.message, 429);
   ```

3. Использовать в сервисе:
   ```typescript
   return Result.err(new RateLimitError("Too many requests"));
   ```

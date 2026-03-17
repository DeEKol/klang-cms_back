# Lesson API: Mobile vs CMS

## Принцип

Один domain-слой (сервисы, порты, сущности) — два API-адаптера.
Каждый контроллер — отдельный адаптер для своего потребителя.
Контроллер не импортирует `*.entity.ts` — только команды и DTOs.

```
Domain (неизменен)
    ↑               ↑
LessonCmsController  LessonMobileController
@Controller("cms")   @Controller("mob")
(WorkerAuthGuard)    (UserAuthGuard)
```

---

## Реализованные эндпоинты

### CMS (Worker) — полный CRUD

| Метод | Путь | Роль |
|---|---|---|
| `GET` | `/cms/sections` | any worker |
| `GET` | `/cms/sections/:id` | any worker |
| `POST` | `/cms/sections` | admin, editor |
| `PATCH` | `/cms/sections/:id` | admin, editor |
| `DELETE` | `/cms/sections/:id` | admin |
| `GET` | `/cms/lessons/:id` | any worker |
| `POST` | `/cms/lessons` | admin, editor |
| `PATCH` | `/cms/lessons/:id` | admin, editor |
| `DELETE` | `/cms/lessons/:id` | admin |
| `POST` | `/cms/pages` | admin, editor |
| `PATCH` | `/cms/pages/:id` | admin, editor |
| `DELETE` | `/cms/pages/:id` | admin |

### Mobile (User) — только чтение

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/mob/sections` | Список всех секций |
| `GET` | `/mob/sections/:id` | Секция с уроками |
| `GET` | `/mob/lessons/:id` | Урок со страницами |

> Прогресс пользователя (`POST /mob/lessons/:id/progress`, `GET /mob/lessons/:id/progress`) будет в модуле `user-progress`.

---

## Файловая структура

```
src/modules/lesson/infrastructure/api/
├── cms/
│   ├── lesson-cms.controller.ts    ← единый CMS-контроллер
│   └── lesson-cms-api.module.ts
├── mobile/
│   ├── lesson-mobile.controller.ts ← единый Mobile-контроллер
│   └── lesson-mobile-api.module.ts
├── dto/                            ← DTOs используют оба адаптера
│   ├── section-create.request.ts
│   ├── section-update.request.ts
│   ├── section.response.ts
│   ├── lesson.request.ts
│   ├── lesson-update.request.ts
│   ├── lesson.response.ts
│   ├── page-create.request.ts
│   ├── page-update.request.ts
│   └── page.response.ts
└── lesson-api.module.ts            ← импортирует оба подмодуля
```

---

## Модули

```typescript
// lesson-cms-api.module.ts
@Module({
    controllers: [LessonCmsController],
})
export class LessonCmsApiModule {}

// lesson-mobile-api.module.ts
@Module({
    controllers: [LessonMobileController],
})
export class LessonMobileApiModule {}

// lesson-api.module.ts
@Module({
    imports: [LessonCmsApiModule, LessonMobileApiModule],
})
export class LessonApiModule {}
```

---

## Swagger

Два отдельных Swagger UI — каждый содержит только свои эндпоинты:

| Swagger UI | Путь | Теги |
|---|---|---|
| CMS | `/api/cms` | `CMS / Workers`, `CMS` |
| Mobile | `/api/mobile` | `Mobile / Auth`, `Mobile` |

Контроллеры по тегам:

| Тег | Контроллер | Модуль |
|---|---|---|
| `CMS / Workers` | `WorkerApiController` | `WorkerApiModule` |
| `CMS` | `LessonCmsController` | `LessonCmsApiModule` |
| `Mobile / Auth` | `UserApiController` | `UserApiModule` |
| `Mobile` | `LessonMobileController` | `LessonMobileApiModule` |

> Подробнее о настройке двух Swagger-документов — см. [docs/AUTH.md](AUTH.md#swagger).

---

## Паттерн контроллера CMS

```typescript
@ApiTags("CMS")
@ApiBearerAuth()
@UseGuards(WorkerAuthGuard)          // class-level: весь контроллер требует worker JWT
@Controller("cms")
export class LessonCmsController {

    // Sections
    @Get("sections")
    getSections() { ... }            // любой аутентифицированный воркер

    @Post("sections")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    createSection(@Body() dto: SectionCreateRequest) { ... }

    @Patch("sections/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN, WorkerRole.EDITOR)
    updateSection(@Param("id") id: string, @Body() dto: SectionUpdateRequest) { ... }

    @Delete("sections/:id")
    @UseGuards(WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN)
    deleteSection(@Param("id") id: string) { ... }

    // Lessons, Pages — по той же схеме
}
```

## Паттерн контроллера Mobile

```typescript
@ApiTags("Mobile")
@ApiBearerAuth()
@UseGuards(UserAuthGuard)            // class-level: весь контроллер требует Firebase token
@Controller("mob")
export class LessonMobileController {

    @Get("sections")
    getSections() { ... }

    @Get("sections/:id")
    getSection(@Param("id") id: string) { ... }

    @Get("lessons/:id")
    getLesson(@Param("id") id: string) { ... }
}
```

---

## Domain-слой — без изменений

Разделение происходит **только на уровне API-адаптеров**. `LessonCrudService`, порты и сущности не меняются.
Оба адаптера инжектируют один и тот же `SLessonCrudUseCases`.

```typescript
constructor(
    @Inject(SLessonCrudUseCases)
    private readonly lessonUseCases: ILessonUseCases,
) {}
```

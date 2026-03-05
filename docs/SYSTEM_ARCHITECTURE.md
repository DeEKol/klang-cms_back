# KLang CMS — System Architecture

> Справочный документ по бизнес-логике, сущностям и их связям.
> Обновляется по мере развития проекта.

---

## 1. Текущее состояние (что уже реализовано)

### 1.1 Реализованные модули

| Модуль | Статус | Что делает |
|--------|--------|------------|
| **Auth** | Частично | Firebase аутентификация → JWT. Нет guards, нет ролей, refresh token не сохраняется |
| **Lesson** | Готов | CRUD для Section → Lesson → Page. Админка создаёт контент |
| **Statistics** | Scaffold | LessonProgress entity создан, CRUD готов |

### 1.2 Критические пробелы (требуют исправления)

1. **Нет `ValidationPipe`** в `main.ts` — декораторы `class-validator` на DTOs сейчас **не работают**. Запросы не валидируются.
2. **Нет JWT Guard / Strategy** — все роуты полностью открыты. Swagger показывает Bearer Auth, но бэкенд его не проверяет.
3. **Refresh token не сохраняется** — генерируется `randomBytes(40)`, возвращается клиенту, но нигде не хранится. Невозможно обновить access token.
4. **Нет ролей** — User не имеет поля role. Нельзя разделить admin / student.
5. **`console.log` в auth service** — строка 24, отладочный вывод idToken в продакшн.
6. **Auth module не следует hexagonal architecture** — UserRepository не реализует port interface, AuthService внедряется напрямую без Symbol DI.

---

## 2. Аутентификация и авторизация

### 2.1 Текущий flow (аутентификация через Firebase)

```
┌──────────┐    Firebase idToken    ┌──────────────┐    JWT accessToken    ┌─────────┐
│  Client  │ ────────────────────►  │  POST /auth  │ ────────────────────► │ Client  │
│ (React)  │                        │  /firebase   │                       │ хранит  │
└──────────┘                        └──────┬───────┘                       │ JWT     │
                                           │                               └─────────┘
                                    1. verifyIdToken (Firebase Admin SDK)
                                    2. createOrUpdateUser (DB)
                                    3. issueTokens (JWT + refresh)
```

**Вердикт**: Firebase для аутентификации — правильный выбор. Он берёт на себя OAuth провайдеров (Google, Apple и т.д.), верификацию email, и управление сессиями на клиенте. Наш бэкенд правильно выдаёт свой JWT после верификации Firebase token.

### 2.2 Что нужно добавить (авторизация)

```
┌──────────┐   Authorization: Bearer <JWT>   ┌─────────────┐   decoded user   ┌────────────┐
│  Client  │ ──────────────────────────────►  │  JwtGuard   │ ──────────────►  │ Controller │
└──────────┘                                  │ + Strategy  │                   └────────────┘
                                              └──────┬──────┘
                                                     │
                                              Проверяет подпись,
                                              извлекает { sub, uid, email, role }
                                                     │
                                              ┌──────┴──────┐
                                              │ RolesGuard  │
                                              │ @Roles()    │
                                              └─────────────┘
```

**Необходимые компоненты:**

| Компонент | Файл | Описание |
|-----------|------|----------|
| JwtStrategy | `auth/domains/services/jwt.strategy.ts` | Passport strategy, извлекает payload из JWT |
| JwtAuthGuard | `auth/modules/api/guards/jwt-auth.guard.ts` | Guard для защиты роутов |
| RolesGuard | `auth/modules/api/guards/roles.guard.ts` | Проверка роли пользователя |
| @Roles() | `auth/modules/api/decorators/roles.decorator.ts` | Декоратор для указания допустимых ролей |
| @CurrentUser() | `auth/modules/api/decorators/current-user.decorator.ts` | Извлечение user из request |
| RefreshToken entity | `auth/modules/persistence/refresh-token/` | Хранение refresh tokens в БД |

### 2.3 Роли пользователей

```typescript
enum UserRole {
    STUDENT = "student",     // Обычный пользователь, изучает корейский
    ADMIN = "admin",         // Управляет контентом (уроки, словарь, предложения)
    // TEACHER = "teacher",  // Зарезервировано на будущее
}
```

**Поле `role`** добавляется в `UserOrmEntity`:
```
@Column({ type: "text", default: UserRole.STUDENT })
role: UserRole;
```

**JWT payload** расширяется: `{ sub, uid, email, role }`

**Защита роутов:**
- `/auth/*` — открыто (логин)
- `/lesson/*`, `/section/*`, `/page/*` (GET) — STUDENT, ADMIN
- `/lesson/*`, `/section/*`, `/page/*` (POST, DELETE) — ADMIN
- `/statistics/*` — STUDENT (свои данные), ADMIN (все данные)
- `/dictionary/*`, `/word/*` и т.д. (GET) — STUDENT, ADMIN
- `/dictionary/*`, `/word/*` и т.д. (POST, DELETE) — ADMIN

---

## 3. Модель данных — полная карта сущностей

### 3.1 ER-диаграмма

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                          CONTENT & LANGUAGE CORE                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────┐  1:N  ┌──────────┐  1:N  ┌────────┐                         ║
║  │ Section  │──────►│  Lesson  │──────►│  Page  │                         ║
║  └──────────┘       └────┬─────┘       └────────┘                         ║
║                          │                                                 ║
║                     M:N  │  M:N                                            ║
║               ┌──────────┼──────────┐                                      ║
║               ▼          ▼          ▼                                      ║
║        ┌────────────┐ ┌──────────────┐                                     ║
║        │ LessonWord │ │LessonSentence│                                     ║
║        └─────┬──────┘ └──────┬───────┘                                     ║
║              │               │                                             ║
║              ▼               ▼                                             ║
║  ┌────────────────┐   ┌──────────────┐                                     ║
║  │     Word       │   │  Sentence    │                                     ║
║  │────────────────│   │──────────────│                                     ║
║  │ korean         │   │ korean       │                                     ║
║  │ romanization   │   │ translation  │                                     ║
║  │ translation    │   │ difficulty   │                                     ║
║  │ partOfSpeech   │   │ audioUrl?    │                                     ║
║  │ difficulty     │   └──────┬───────┘                                     ║
║  │ audioUrl?      │          │                                             ║
║  │ imageUrl?      │     M:N  │                                             ║
║  │ phonetic?      │          ▼                                             ║
║  │ notes?         │   ┌──────────────┐                                     ║
║  └──┬──────┬──────┘   │ SentenceWord │                                     ║
║     │      │          │──────────────│                                     ║
║     │      │          │ position     │ ◄── Позиция слова в предложении     ║
║     │      │          │ isTarget     │ ◄── Можно убрать для Word Insertion  ║
║     │      │          └──────────────┘                                     ║
║     │      │                                                               ║
║     │ M:N  │ M:N                                                           ║
║     │      │                                                               ║
║     ▼      ▼                                                               ║
║  ┌──────┐ ┌───────────────┐                                                ║
║  │ Word │ │   Category    │                                                ║
║  │ Char │ │───────────────│                                                ║
║  │      │ │ name          │  ◄── "Еда", "Транспорт", "Глаголы движения"   ║
║  └──┬───┘ │ description?  │                                                ║
║     │     │ parentId?     │  ◄── Иерархия: "Еда" > "Фрукты"              ║
║     ▼     └───────────────┘                                                ║
║  ┌────────────────┐                                                        ║
║  │   Character    │                                                        ║
║  │────────────────│                                                        ║
║  │ character      │  ◄── ㄱ, ㅏ, 가                                        ║
║  │ type           │  ◄── consonant | vowel | compound | syllable           ║
║  │ romanization   │                                                        ║
║  │ strokeData     │  ◄── JSON: данные для Drawing Board и AI-сверки        ║
║  │ strokeCount    │                                                        ║
║  │ audioUrl?      │                                                        ║
║  └────────────────┘                                                        ║
║                                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                          WORD — РАСШИРЕННАЯ МОДЕЛЬ                         ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  Word — центральная сущность. Расширяется через связанные таблицы,         ║
║  а не через добавление колонок:                                            ║
║                                                                            ║
║  ┌────────────────┐  1:N  ┌────────────────────┐                           ║
║  │     Word       │──────►│     WordForm       │                           ║
║  │                │       │────────────────────│                           ║
║  │ korean: "가다"  │       │ form: "갑니다"     │ ◄── Конъюгация           ║
║  │                │       │ formType: "formal"  │ ◄── Тип формы            ║
║  │                │       │ tense: "present"    │ ◄── Время                ║
║  │                │       │ romanization        │                           ║
║  │                │       │ notes?              │                           ║
║  │                │       └────────────────────┘                           ║
║  │                │                                                        ║
║  │                │  M:N  ┌────────────────────┐                           ║
║  │                │──────►│   WordCategory     │──────► Category            ║
║  │                │       │ (pivot)            │                            ║
║  │                │       └────────────────────┘                           ║
║  │                │                                                        ║
║  │                │  M:N  ┌────────────────────┐                           ║
║  │                │──────►│   WordCharacter    │──────► Character           ║
║  │                │       │ position: number   │                            ║
║  └────────────────┘       └────────────────────┘                           ║
║                                                                            ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                       USER & PROGRESS TRACKING                             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ┌──────────────────┐                                                      ║
║  │      User        │                                                      ║
║  │──────────────────│                                                      ║
║  │ id (UUID)        │                                                      ║
║  │ uid (Firebase)   │                                                      ║
║  │ email            │                                                      ║
║  │ displayName      │                                                      ║
║  │ photoURL         │                                                      ║
║  │ provider         │                                                      ║
║  │ role ★NEW★       │ ◄── student | admin                                 ║
║  │ meta (JSON)      │                                                      ║
║  └───────┬──────────┘                                                      ║
║          │                                                                 ║
║          ├──── 1:N ──► LessonProgress (✅ сделан)                          ║
║          │             │ userId + lessonId (unique)                         ║
║          │             │ status, completionPercentage,                      ║
║          │             │ timeSpentSeconds, attempts, score...               ║
║          │                                                                 ║
║          ├──── 1:N ──► UserWordProgress                                    ║
║          │             │ userId + wordId (unique)                           ║
║          │             │ masteryLevel (0-100)                               ║
║          │             │ timesCorrect, timesIncorrect                       ║
║          │             │ lastPracticedAt                                    ║
║          │             │ source: lesson | word_matcher |                    ║
║          │             │         drawing | word_insertion                   ║
║          │                                                                 ║
║          ├──── 1:N ──► UserCharacterProgress                               ║
║          │             │ userId + characterId (unique)                      ║
║          │             │ masteryLevel (0-100)                               ║
║          │             │ drawingAccuracy (0-100, от AI)                     ║
║          │             │ timesDrawn                                         ║
║          │             │ lastPracticedAt                                    ║
║          │                                                                 ║
║          └──── 1:N ──► GameSession                                         ║
║                        │ userId                                            ║
║                        │ gameType: word_matcher | drawing | word_insertion  ║
║                        │ score, totalQuestions, correctAnswers              ║
║                        │ durationSeconds                                   ║
║                        │ lessonId? (если привязано к уроку)                ║
║                        │ completedAt                                       ║
║                        │                                                   ║
║                        └──── 1:N ──► GameSessionItem                       ║
║                                      │ wordId? / characterId? /            ║
║                                      │ sentenceId?                         ║
║                                      │ wasCorrect                          ║
║                                      │ responseTimeMs                      ║
║                                      │ userAnswer?                         ║
║                                                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Детализация сущностей

### 4.1 Word (Слово) — центральная сущность

Самая важная сущность в системе. Все три игры, уроки, словарь и прогресс крутятся вокруг неё.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | Публичный ID |
| korean | string | Корейское написание: "사과" |
| romanization | string | Романизация: "sagwa" |
| translation | string | Перевод: "яблоко" |
| partOfSpeech | enum | noun, verb, adjective, adverb, particle, etc. |
| difficultyLevel | number (1-5) | Уровень сложности |
| phonetic | string? | Фонетическая запись (IPA или кастомная): "[sagwa]" |
| audioUrl | string? | Ссылка на аудио произношения |
| imageUrl | string? | Ссылка на картинку-ассоциацию |
| notes | string? | Примечания для админа (нюансы использования) |
| isActive | boolean | Активно ли слово (soft delete / draft) |

**Что НЕ хранится в Word напрямую (расширяемость):**
- Формы/окончания → `WordForm` (отдельная таблица)
- Категории → `WordCategory` (M:N pivot)
- Символы → `WordCharacter` (M:N pivot)
- Связь с уроками → `LessonWord` (M:N pivot)
- Связь с предложениями → `SentenceWord` (M:N pivot)

### 4.2 WordForm (Формы слова / Окончания)

Корейский язык имеет богатую систему окончаний. Глагол "가다" (идти) имеет формы:
- 갑니다 (formal present)
- 갔습니다 (formal past)
- 가요 (polite present)
- 가 (informal present)
- ...

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | |
| wordId | FK → Word | Базовое слово |
| form | string | Конкретная форма: "갑니다" |
| formType | enum | formal, polite, informal, written, etc. |
| tense | enum? | present, past, future, imperative, etc. |
| romanization | string | Романизация формы |
| translation | string? | Перевод формы если отличается |
| notes | string? | Грамматическое пояснение |

**Расширяемость**: Новые formType и tense можно добавлять без миграций, если хранить как text. Или использовать enum с миграцией для строгости.

### 4.3 Category (Категория / Словарь)

Иерархическая система категорий для группировки слов.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | |
| name | string | "Еда", "Фрукты", "Глаголы движения" |
| description | string? | Описание категории |
| parentId | FK → Category? | Родительская категория (self-referencing) |
| order | number | Порядок отображения |
| imageUrl | string? | Иконка категории |

**Примеры иерархии:**
```
Еда (parent: null)
├── Фрукты (parent: Еда)
├── Овощи (parent: Еда)
└── Напитки (parent: Еда)
Транспорт (parent: null)
Части тела (parent: null)
Грамматика (parent: null)
├── Глаголы движения (parent: Грамматика)
└── Счётные слова (parent: Грамматика)
```

### 4.4 Character (Символ Hangul)

Для Drawing Board и изучения алфавита.

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | |
| character | string | ㄱ, ㅏ, 가 |
| type | enum | consonant, vowel, compound_consonant, compound_vowel, syllable |
| romanization | string | "g", "a", "ga" |
| name | string | Название символа: "기역", "아" |
| strokeData | JSON | Данные для отрисовки и AI-сверки (массив точек/кривых) |
| strokeCount | number | Количество штрихов |
| audioUrl | string? | Произношение |
| order | number | Порядок в алфавите |

**strokeData формат** (для AI-сервиса сравнения):
```json
{
  "strokes": [
    {
      "order": 1,
      "points": [[x1,y1], [x2,y2], ...],
      "direction": "top-to-bottom"
    }
  ],
  "boundingBox": { "width": 100, "height": 100 }
}
```

### 4.5 Sentence (Предложение)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | |
| korean | string | "나는 학교에 갑니다" |
| translation | string | "Я иду в школу" |
| difficultyLevel | number (1-5) | |
| audioUrl | string? | Аудио всего предложения |

### 4.6 SentenceWord (Pivot: Слово в предложении)

| Поле | Тип | Описание |
|------|-----|----------|
| id | UUID | |
| sentenceId | FK → Sentence | |
| wordId | FK → Word | |
| position | number | Позиция слова (0-based) |
| isTarget | boolean | Можно ли убрать для Word Insertion игры |
| displayForm | string? | Конкретная форма слова в этом предложении (если отличается от базовой) |

**displayForm** нужен потому что в предложении "학교에 **갑니다**" слово "가다" стоит в форме "갑니다". Мы храним ссылку на базовое слово "가다", но отображаем "갑니다".

### 4.7 GameSession и GameSessionItem

См. раздел 3.1 (ER-диаграмма). Ключевой момент — `GameSessionItem` ссылается полиморфно на Word, Character или Sentence в зависимости от типа игры.

---

## 5. Связь игр с сущностями

### 5.1 Word Matcher (Сопоставление слов)

```
Входные данные:  Word[] (из LessonWord или Category)
Игровой процесс: Показать korean ↔ translation, сопоставить
Результат:       GameSession + GameSessionItem[] (wordId, wasCorrect)
Прогресс:        UserWordProgress обновляется (masteryLevel, timesCorrect)
```

### 5.2 Drawing Board (Рисование иероглифов)

```
Входные данные:  Character[] (consonants/vowels/syllables)
Игровой процесс: Показать символ → пользователь рисует → AI сверяет
Результат:       GameSession + GameSessionItem[] (characterId, wasCorrect)
Прогресс:        UserCharacterProgress (drawingAccuracy от AI)
AI-сервис:       Принимает strokeData эталона + рисунок пользователя → score
```

### 5.3 Word Insertion (Вставка слова в предложение)

```
Входные данные:  Sentence с SentenceWord[] (где isTarget=true)
Игровой процесс: Показать предложение с пропуском → выбрать слово
Результат:       GameSession + GameSessionItem[] (sentenceId + wordId)
Прогресс:        UserWordProgress обновляется
Логика выбора:   Берём Sentence, убираем слово где isTarget=true,
                 предлагаем 3-4 варианта (правильный + distractor'ы)
```

---

## 6. Порядок реализации (Road Map)

### Phase 1 — Фундамент (текущий этап)

| # | Задача | Статус |
|---|--------|--------|
| 1.1 | LessonProgress entity + CRUD | ✅ Готов |
| 1.2 | Добавить `ValidationPipe` в main.ts | ⬜ Критично |
| 1.3 | Добавить `role` в User entity + миграция | ⬜ Критично |
| 1.4 | JwtStrategy + JwtAuthGuard | ⬜ Критично |
| 1.5 | RolesGuard + @Roles() + @CurrentUser() | ⬜ Критично |
| 1.6 | Защитить все существующие роуты | ⬜ Критично |
| 1.7 | Доделать генераторы Plop (delete command и др.) | ⬜ |

### Phase 2 — Языковое ядро

| # | Задача | Зависимости |
|---|--------|-------------|
| 2.1 | Category entity + CRUD | — |
| 2.2 | Word entity + CRUD | — |
| 2.3 | WordCategory (pivot) | Word, Category |
| 2.4 | WordForm entity + CRUD | Word |
| 2.5 | Character entity + CRUD | — |
| 2.6 | WordCharacter (pivot) | Word, Character |

### Phase 3 — Предложения

| # | Задача | Зависимости |
|---|--------|-------------|
| 3.1 | Sentence entity + CRUD | — |
| 3.2 | SentenceWord (pivot) | Sentence, Word |
| 3.3 | LessonWord (pivot) | Lesson, Word |
| 3.4 | LessonSentence (pivot) | Lesson, Sentence |

### Phase 4 — Игры и прогресс

| # | Задача | Зависимости |
|---|--------|-------------|
| 4.1 | GameSession entity + CRUD | User |
| 4.2 | GameSessionItem entity | GameSession, Word, Character, Sentence |
| 4.3 | UserWordProgress entity | User, Word |
| 4.4 | UserCharacterProgress entity | User, Character |
| 4.5 | Word Matcher game service | Word, GameSession, UserWordProgress |
| 4.6 | Word Insertion game service | Sentence, SentenceWord, GameSession |
| 4.7 | Drawing Board game service + AI integration | Character, GameSession, UserCharacterProgress |

---

## 7. Принципы расширяемости

### 7.1 Новые типы игр
Добавление нового типа игры не требует изменения существующих сущностей:
1. Добавить значение в `gameType` enum
2. Создать новый game service
3. `GameSessionItem` уже полиморфный (wordId?, characterId?, sentenceId?)

### 7.2 Новые свойства слова
Вместо добавления колонок в Word, создаём связанные таблицы:
- Новые формы → WordForm (уже предусмотрен)
- Новые категории → Category + WordCategory
- Синонимы/антонимы → WordRelation (pivot: wordId, relatedWordId, relationType)

### 7.3 Новые роли
`UserRole` enum расширяется: `teacher`, `moderator`, etc. RolesGuard не меняется.

### 7.4 Множественные языки перевода
Если потребуется мультиязычность переводов (не только русский):
- WordTranslation (wordId, language, translation) вместо поля `translation` в Word
- Пока не нужно, не реализуем

---

## 8. Технические решения

### 8.1 Двойной ID (idPk + id)
Все ORM entities используют:
- `idPk` (auto-increment) — внутренний ключ для foreign keys, joins, индексов
- `id` (UUID) — публичный бизнес-идентификатор для API

### 8.2 Soft Delete
Для контентных сущностей (Word, Sentence, Category) использовать `isActive: boolean` вместо физического удаления. Для прогресса пользователя — физическое удаление допустимо.

### 8.3 Аудио и изображения
URL-ссылки на файлы. Хранилище (S3, Firebase Storage) — отдельный вопрос, не влияет на схему БД.

### 8.4 AI-сервис для Drawing Board
Внешний сервис (или встроенный Python микросервис), принимает:
- Эталонный `strokeData` из Character entity
- Рисунок пользователя (массив точек)
- Возвращает `accuracy: number (0-100)`

Интегрируется через отдельный NestJS сервис с HTTP-клиентом.

# KLang CMS — Entity Relationships Diagram

> Диаграмма связей между сущностями системы.
> Детальное описание каждой сущности — в [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md).

---

## Core Language Entities

```
┌──────────────┐       ┌───────────────┐       ┌──────────────────┐
│   Character  │       │     Word      │       │    Sentence      │
│──────────────│       │───────────────│       │──────────────────│
│ character    │◄──┐   │ korean        │   ┌──►│ korean           │
│ type         │   │   │ romanization  │   │   │ translation      │
│ romanization │   │   │ translation   │   │   │ difficultyLevel  │
│ strokeData   │   │   │ partOfSpeech  │   │   │ audioUrl?        │
│ strokeOrder  │   │   │ difficultyLvl │   │   └──────────────────┘
│ audioUrl?    │   │   │ audioUrl?     │   │
│ exampleWord  │   │   │ imageUrl?     │   │
└──────────────┘   │   └───────┬───────┘   │
                   │           │           │
                   │    ┌──────┴──────┐    │
                   │    │             │    │
              ┌────┴────┴──┐   ┌──────┴────┴──┐
              │ WordChar   │   │ SentenceWord │
              │ (pivot)    │   │ (pivot)      │
              │────────────│   │──────────────│
              │ wordId     │   │ sentenceId   │
              │ characterId│   │ wordId       │
              │ position   │   │ position     │
              └────────────┘   │ isTarget     │
                               └──────────────┘
                         (isTarget = можно ли убрать
                          это слово для игры insertion)
```

## Lesson & Content Structure

```
┌──────────┐     ┌──────────┐     ┌────────┐
│ Section  │────►│  Lesson  │────►│  Page  │
│          │ 1:N │          │ 1:N │        │
└──────────┘     └────┬─────┘     └────────┘
                      │
                      │ M:N
                 ┌────┴──────┐
                 │ LessonWord│
                 │ (pivot)   │
                 │───────────│
                 │ lessonId  │
                 │ wordId    │──────────►  Word
                 │ order     │
                 └───────────┘

   Lesson также может ссылаться на Sentences:

                 ┌────────────────┐
                 │ LessonSentence │
                 │ (pivot)        │
                 │────────────────│
                 │ lessonId       │
                 │ sentenceId     │──────►  Sentence
                 │ order          │
                 └────────────────┘
```

## Word — Extended Model

```
┌────────────────┐  1:N  ┌────────────────────┐
│     Word       │──────►│     WordForm       │
│                │       │────────────────────│
│ korean: "가다"  │       │ form: "갑니다"     │  ◄── Конъюгация
│                │       │ formType: "formal"  │  ◄── Тип формы
│                │       │ tense: "present"    │  ◄── Время
│                │       │ romanization        │
│                │       │ notes?              │
│                │       └────────────────────┘
│                │
│                │  M:N  ┌────────────────────┐
│                │──────►│   WordCategory     │──────► Category
│                │       │ (pivot)            │        │ name
│                │       └────────────────────┘        │ parentId? (иерархия)
│                │                                     └───────────
│                │  M:N  ┌────────────────────┐
│                │──────►│   WordCharacter    │──────► Character
│                │       │ position: number   │
└────────────────┘       └────────────────────┘
```

## User Progress & Statistics

```
┌──────────────────┐
│      User        │
│──────────────────│
│ id (UUID)        │
│ uid (Firebase)   │
│ email            │
│ displayName      │
│ role             │  ◄── student | admin
└───────┬──────────┘
        │
        ├──── 1:N ────► LessonProgress    (✅ сделан)
        │               │ userId + lessonId (unique)
        │               │ status, completionPercentage,
        │               │ timeSpentSeconds, attempts, score...
        │
        ├──── 1:N ────► UserWordProgress
        │               │ userId + wordId (unique)
        │               │ masteryLevel (0-100)
        │               │ timesCorrect, timesIncorrect
        │               │ lastPracticedAt
        │               │ source (lesson | game)
        │
        ├──── 1:N ────► UserCharacterProgress
        │               │ userId + characterId (unique)
        │               │ masteryLevel (0-100)
        │               │ drawingAccuracy (0-100, от AI)
        │               │ timesDrawn
        │               │ lastPracticedAt
        │
        └──── 1:N ────► GameSession
                        │ gameType: word_matcher | drawing | word_insertion
                        │ score, totalQuestions, correctAnswers
                        │ durationSeconds, lessonId?, completedAt
                        │
                        └──── 1:N ────► GameSessionItem
                                        │ wordId? / characterId? / sentenceId?
                                        │ wasCorrect, responseTimeMs
                                        │ userAnswer?
```

## Full ER Summary

```
Character ◄───── WordCharacter ─────► Word ◄───── SentenceWord ─────► Sentence
                                       │
                              ┌────────┼────────┐
                              ▼        ▼        ▼
                        LessonWord  UserWord  GameSession
                              │     Progress    Item
                              ▼        │        │
                           Lesson      │        ▼
                              │        │   GameSession
                              ▼        │        │
                        LessonProgress │        │
                              │        ▼        ▼
                              └───────►User◄────┘
                                        │
                                        ▼
                              UserCharacterProgress
                                        │
                                        ▼
                                    Character
```

## Games → Entities Mapping

| Игра | Входные данные | Прогресс | Результат |
|------|---------------|----------|-----------|
| **Word Matcher** | Word[] (из LessonWord или Category) | UserWordProgress | GameSession + GameSessionItem(wordId) |
| **Drawing Board** | Character[] | UserCharacterProgress | GameSession + GameSessionItem(characterId) |
| **Word Insertion** | Sentence + SentenceWord(isTarget=true) | UserWordProgress | GameSession + GameSessionItem(sentenceId, wordId) |

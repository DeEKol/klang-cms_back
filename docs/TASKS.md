# Tasks

## Структура директории

```
tasks/
└── YYYY-MM-DD--TASK-NNN--short-slug.md
```

Пример: `tasks/2026-03-17--TASK-000--template.md`

---

## Формат файла таска

```markdown
---
title: "Краткое описание задачи"
assignee: "ai-agent"   # или "ivanov", "unassigned"
status: "open"         # open | in-progress | review | closed
priority: "high"       # low | medium | high | critical
labels: ["bug", "auth"]
created_at: YYYY-MM-DD
created_by: "Имя автора"
closed_at: YYYY-MM-DD   # заполняется при переводе в closed
---

## Описание

Что нужно сделать и почему.

## Шаги для воспроизведения

(для bug-тасков)

1. ...

## Ожидаемое поведение

Что должно происходить.

## Критерии готовности (DoD)

- [ ] ...

## Результат

(заполняется при закрытии — что было сделано, какие файлы созданы/изменены)
```

---

## Правила

- **Имя файла**: `YYYY-MM-DD--TASK-NNN--kebab-slug.md` — дата создания, порядковый номер, короткое описание
- **Статусы**: `open` → `in-progress` → `review` → `closed`
- **Приоритеты**: `low`, `medium`, `high`, `critical`
- **Assignee**: конкретное имя, `ai-agent` (для задач ИИ-агента), или `unassigned`
- **Labels**: свободные теги — модуль, тип (`bug`, `feature`, `refactor`, `docs`), область (`auth`, `api`, `db`)
- Каждый таск — отдельный файл, не редактировать номер после создания
- DoD (Definition of Done) обязателен — конкретные, проверяемые пункты
- При закрытии: `status: closed`, заполнить `closed_at` и секцию `## Результат`

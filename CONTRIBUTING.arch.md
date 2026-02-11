## RULES
- `kebab-case` для файлов;
- `PascalCase` для классов;
- `domains` в качестве слоя домена (совместно с `domains/ports/in` и `domains/ports/out`);
- `*.entity.ts` — domain entities;
- `*.orm-entity.ts` — ORM/adapters;
- `*-repository.adapter.ts` — adapter implementation;
- `i-*.port.ts` — interface/port in domain layer;
- `*.dto.ts` — api dtos;
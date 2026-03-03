# Plop Templates Guide

Подробное руководство по всем Plop шаблонам в проекте.

## Структура шаблонов

Все шаблоны находятся в `plop-templates/` и используют Handlebars синтаксис.

### Доступные Handlebars helpers

```javascript
{{pascalCase entity}}  // user-profile → UserProfile
{{kebabCase entity}}   // UserProfile → user-profile
{{upperCase entity}}   // user → USER
{{eq a b}}            // a === b ? true : false
```

## Domain Layer Templates

### 1. entity-crud.hbs
**Генерируется в**: `domains/entities/{entity}.entity.ts`

Создает domain entity с:
- Private readonly поля с underscore prefix
- Getters для всех полей
- Статический метод `mapToDomain(ormEntity)` для маппинга из ORM entity

**Пример вывода**:
```typescript
export class UserEntity {
    constructor(
        private readonly _id: string,
        private readonly _email: string,
    ) {}

    get id(): string { return this._id; }
    get email(): string { return this._email; }

    static mapToDomain(ormEntity: UserOrmEntity | null): UserEntity | null {
        if (ormEntity)
            return new UserEntity(ormEntity.id, ormEntity.email);
        else return null;
    }
}
```

### 2. command-create.hbs
**Генерируется в**: `domains/ports/in/create-{entity}.command.ts`

Command для создания entity с полями из конфигурации.

**Пример вывода**:
```typescript
export class CreateUserCommand {
    constructor(private readonly _email: string) {}
    get email(): string { return this._email; }
}
```

### 3. command-update.hbs
**Генерируется в**: `domains/ports/in/update-{entity}.command.ts`

Command для обновления с:
- Обязательный id
- Опциональные поля (type | undefined)

**Пример вывода**:
```typescript
export class UpdateUserCommand {
    constructor(
        private readonly _id: string,
        private readonly _email?: string,
    ) {}
    get id(): string { return this._id; }
    get email(): string | undefined { return this._email; }
}
```

### 4. command-delete.hbs
**Генерируется в**: `domains/ports/in/delete-{entity}.command.ts`

Простой command с только id:
```typescript
export class DeleteUserCommand {
    constructor(private readonly _id: string) {}
    get id(): string { return this._id; }
}
```

### 5. command-get.hbs
**Генерируется в**: `domains/ports/in/get-{entity}.command.ts`

Идентичен delete command - только id для получения:
```typescript
export class GetUserCommand {
    constructor(private readonly _id: string) {}
    get id(): string { return this._id; }
}
```

### 6. use-cases-interface.hbs
**Генерируется в**: `domains/ports/in/i-{entity}.use-cases.ts`

Интерфейс Use Cases с Symbol для DI (паттерн из lesson):

```typescript
export const SUserUseCases = Symbol("IUserUseCases");

export interface IUserUseCases {
    getUser(command: GetUserCommand): Promise<UserEntity | null>;
    createUser(command: CreateUserCommand): Promise<UserEntity | null>;
    updateUser(command: UpdateUserCommand): Promise<boolean>;
    deleteUser(command: DeleteUserCommand): Promise<boolean>;
}
```

### 7. repo-port-crud.hbs
**Генерируется в**: `domains/ports/out/i-{entity}-repository.port.ts`

Repository Port интерфейс с CRUD операциями:

```typescript
export interface IUserRepositoryPort {
    findById(id: string): Promise<UserOrmEntity | null>;
    create(email: string): Promise<UserOrmEntity | null>;
    update(id: string, email?: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
```

### 8. service-crud.hbs
**Генерируется в**: `domains/services/{entity}-crud.service.ts`

NestJS сервис, реализующий use cases:

```typescript
@Injectable()
export class UserCrudService implements IUserUseCases {
    constructor(private readonly _userRepository: IUserRepositoryPort) {}

    async getUser(command: GetUserCommand): Promise<UserEntity | null> {
        const ormEntity = await this._userRepository.findById(command.id);
        return UserEntity.mapToDomain(ormEntity);
    }

    async createUser(command: CreateUserCommand): Promise<UserEntity | null> {
        const ormEntity = await this._userRepository.create(command.email);
        return UserEntity.mapToDomain(ormEntity);
    }

    async updateUser(command: UpdateUserCommand): Promise<boolean> {
        return this._userRepository.update(command.id, command.email);
    }

    async deleteUser(command: DeleteUserCommand): Promise<boolean> {
        return this._userRepository.delete(command.id);
    }
}
```

## API Layer Templates

### 9. dto-request.hbs
**Генерируется в**: `modules/api/dto/{entity}.request.ts`

DTO для create запроса с @ApiProperty:

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class UserRequest {
    @ApiProperty({ example: "Example email" })
    email: string;
}
```

### 10. dto-update-request.hbs
**Генерируется в**: `modules/api/dto/{entity}-update.request.ts`

DTO для update с обязательным id и опциональными полями:

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class UserUpdateRequest {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2" })
    id: string;

    @ApiProperty({ example: "Example email", required: false })
    email?: string;
}
```

### 11. dto-delete-request.hbs
**Генерируется в**: `modules/api/dto/{entity}-delete.request.ts`

DTO для delete (только id):

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class UserDeleteRequest {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2" })
    id: string;
}
```

### 12. dto-find-request.hbs
**Генерируется в**: `modules/api/dto/{entity}-find.request.ts`

DTO для get/find (только id):

```typescript
import { ApiProperty } from "@nestjs/swagger";

export class UserFindRequest {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2" })
    id: string;
}
```

### 13. dto-response.hbs
**Генерируется в**: `modules/api/dto/{entity}.response.ts`

Response DTO с static mapToResponse():

```typescript
import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "../../../domains/entities/user.entity";

export class UserResponse {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2" })
    id: string;

    @ApiProperty({ example: "Example email" })
    email: string;

    constructor(id: string, email: string) {
        this.id = id;
        this.email = email;
    }

    static mapToResponse(entity: UserEntity | null): UserResponse | null {
        if (entity) return new UserResponse(entity.id, entity.email);
        else return null;
    }
}
```

### 14. controller-crud.hbs
**Генерируется в**: `modules/api/{entity}.controller.ts`

Полный CRUD контроллер с 4 endpoints:

```typescript
@ApiTags("User")
@Controller("auth/user")
export class UserController {
    constructor(
        @Inject(SUserUseCases)
        private readonly _userUseCases: IUserUseCases,
    ) {}

    @Get("get/:id")
    async findOne(@Param() { id }: UserFindRequest): Promise<UserResponse | null> {
        const command = new GetUserCommand(id);
        const entity = await this._userUseCases.getUser(command);
        return UserResponse.mapToResponse(entity);
    }

    @Delete("delete/:id")
    async deleteOne(@Param() { id }: UserDeleteRequest): Promise<boolean> {
        const command = new DeleteUserCommand(id);
        return this._userUseCases.deleteUser(command);
    }

    @Post("update")
    async update(@Body() dto: UserUpdateRequest): Promise<boolean> {
        const command = new UpdateUserCommand(dto.id, dto.email);
        return this._userUseCases.updateUser(command);
    }

    @Post("create")
    async create(@Body() dto: UserRequest): Promise<UserResponse | null> {
        const command = new CreateUserCommand(dto.email);
        const entity = await this._userUseCases.createUser(command);
        return UserResponse.mapToResponse(entity);
    }
}
```

## Persistence Layer Templates

### 15. adapter-crud.hbs
**Генерируется в**: `modules/persistence/{entity}-repository.adapter.ts`

TypeORM Repository Adapter:

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IUserRepositoryPort } from "../../domains/ports/out/i-user-repository.port";
import { UserOrmEntity } from "./user/user.orm-entity";

@Injectable()
export class UserRepositoryAdapter implements IUserRepositoryPort {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly _userRepository: Repository<UserOrmEntity>,
    ) {}

    async findById(id: string): Promise<UserOrmEntity | null> {
        return this._userRepository.findOne({ where: { id } });
    }

    async create(email: string): Promise<UserOrmEntity | null> {
        const entity = this._userRepository.create({ email });
        return this._userRepository.save(entity);
    }

    async update(id: string, email?: string): Promise<boolean> {
        const updateData: Partial<UserOrmEntity> = {};
        if (email !== undefined) updateData.email = email;

        const result = await this._userRepository.update(id, updateData);
        return result.affected !== null && result.affected > 0;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this._userRepository.delete(id);
        return result.affected !== null && result.affected > 0;
    }
}
```

### 16. orm-entity.hbs
**Генерируется в**: `modules/persistence/{entity}/{entity}.orm-entity.ts`

**ВАЖНО**: Генерируется БЕЗ TypeORM decorators - их нужно добавить вручную!

```typescript
// CLAUDE: Add TypeORM decorators (@Entity, @Column, @PrimaryGeneratedColumn, etc.)
export class UserOrmEntity {
    id: string;
    email: string;
}
```

## Module Templates

### 17. main-module.hbs
**Генерируется в**: `{module}/{module}.module.ts`

Главный модуль, импортирующий api и persistence:

```typescript
import { Module } from "@nestjs/common";
import { AuthApiModule } from "./modules/api/auth-api.module";
import { AuthPersistenceModule } from "./modules/persistence/auth-persistence.module";

@Global()
@Module({
    imports: [AuthPersistenceModule, AuthApiModule],
    exports: [AuthPersistenceModule],
})
export class AuthModule {}
```

## Вспомогательные Templates

### 18. module-api.hbs
**Генерируется в**: `modules/api/{module}-api.module.ts`

Базовый API модуль:

```typescript
import { Module } from "@nestjs/common";

@Module({
    controllers: [],
    providers: [],
})
export class AuthApiModule {}
```

### 19. persistence-module.hbs
**Генерируется в**: `modules/persistence/{module}-persistence.module.ts`

Базовый Persistence модуль с TypeORM:

```typescript
import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([])],
    providers: [],
    exports: [],
})
export class AuthPersistenceModule {}
```

## Использование

### Создание entity с полным CRUD

```bash
npm run gen:entity
```

Prompts:
1. Module name: `auth`
2. Entity name: `user`
3. Fields: `email:string,age:number`

Результат: 18 файлов со всем необходимым для CRUD операций.

### Создание нового модуля

```bash
npm run gen:module
```

Prompt:
1. Module name: `blog`

Результат: Структура папок + базовые module файлы.

## ESLint/Prettier Compliance

Все шаблоны следуют правилам:
- ✅ Двойные кавычки
- ✅ Точки с запятой
- ✅ 4 пробела для отступов
- ✅ Trailing commas
- ✅ Arrow function parentheses

## Что делать после генерации

1. **ORM Entity** - добавить TypeORM decorators
2. **Persistence Module** - зарегистрировать adapter и service
3. **API Module** - зарегистрировать controller
4. **DTOs** - добавить class-validator decorators
5. **Service** - добавить бизнес-логику при необходимости
6. **Tests** - написать тесты

## Модификация шаблонов

При изменении шаблонов:
1. Тестируй генерацию: `npm run gen:entity`
2. Проверяй ESLint: `npm run lint`
3. Проверяй архитектуру: `npm run arch:validate`
4. Обновляй эту документацию при необходимости

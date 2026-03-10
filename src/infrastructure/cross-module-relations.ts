import { getMetadataArgsStorage } from "typeorm";
import { UserProgressOrmEntity } from "../modules/lesson/infrastructure/persistence/user-progress/user-progress.orm-entity";
import { UserOrmEntity } from "../modules/user/infrastructure/persistence/user/user.orm-entity";

/**
 * Cross-module TypeORM relations registered as side-effect on import.
 * Keeps individual ORM entities free of cross-module imports,
 * following Hexagonal Architecture boundaries.
 *
 * Import this file once before TypeORM initializes:
 *   import "./infrastructure/cross-module-relations";
 */
const storage = getMetadataArgsStorage();

storage.relations.push({
    target: UserProgressOrmEntity,
    propertyName: "user",
    isLazy: false,
    relationType: "many-to-one",
    type: () => UserOrmEntity,
    options: { nullable: false },
});

storage.joinColumns.push({
    target: UserProgressOrmEntity,
    propertyName: "user",
    name: "user_id",
    referencedColumnName: "id",
});

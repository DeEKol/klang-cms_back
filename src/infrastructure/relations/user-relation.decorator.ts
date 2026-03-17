import { ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@modules/user/infrastructure/persistence/user/user.orm-entity";

/**
 * Applies ManyToOne relation to UserOrmEntity with join column "user_id".
 * Use in ORM entities to reference a user without cross-module imports.
 */
export function UserRelation(): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        ManyToOne(() => UserOrmEntity, { nullable: false })(target, propertyKey as string);
        JoinColumn({ name: "user_id", referencedColumnName: "id" })(target, propertyKey as string);
    };
}

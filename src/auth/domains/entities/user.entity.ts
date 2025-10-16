import { UserOrmEntity } from "../../modules/persistence/user/user.orm-entity";

import type { TDecodedIdToken } from "../../../firebase/admin";

export class UserEntity {
    constructor(
        private readonly _id: string,
        private readonly _uid: string,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
        private readonly _email?: string,
        private readonly _displayName?: string,
        private readonly _photoURL?: string,
        private readonly _provider?: string,
        private readonly _meta?: TDecodedIdToken,
    ) {}

    get id(): string {
        return this._id;
    }

    get uid(): string {
        return this._uid;
    }

    get email(): string | undefined {
        return this._email;
    }

    get displayName(): string | undefined {
        return this._displayName;
    }

    get photoURL(): string | undefined {
        return this._photoURL;
    }

    get provider(): string | undefined {
        return this._provider;
    }

    get meta(): TDecodedIdToken | undefined {
        return this._meta;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    static mapToDomain(userOrmEntity: UserOrmEntity | null): UserEntity | null {
        return userOrmEntity
            ? new UserEntity(
                  userOrmEntity.id,
                  userOrmEntity.uid,
                  userOrmEntity.createdAt,
                  userOrmEntity.updatedAt,
                  userOrmEntity.email,
                  userOrmEntity.displayName,
                  userOrmEntity.photoURL,
                  userOrmEntity.provider,
                  userOrmEntity.meta,
              )
            : null;
    }
}

import type { TDecodedIdToken } from "../ports/out/i-firebase-auth.port";

export interface IUserData {
    id: string;
    uid: string;
    createdAt: Date;
    updatedAt: Date;
    email?: string;
    displayName?: string;
    photoURL?: string;
    provider?: string;
    meta?: TDecodedIdToken;
}

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

    static mapToDomain(data: IUserData | null): UserEntity | null {
        return data
            ? new UserEntity(
                  data.id,
                  data.uid,
                  data.createdAt,
                  data.updatedAt,
                  data.email,
                  data.displayName,
                  data.photoURL,
                  data.provider,
                  data.meta,
              )
            : null;
    }
}

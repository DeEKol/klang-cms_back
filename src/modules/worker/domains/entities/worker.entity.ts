export enum WorkerRole {
    ADMIN = "admin",
    EDITOR = "editor",
}

export interface IWorkerData {
    id: string;
    email: string;
    passwordHash: string;
    role: WorkerRole;
    displayName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class WorkerEntity {
    constructor(
        private readonly _id: string,
        private readonly _email: string,
        private readonly _passwordHash: string,
        private readonly _role: WorkerRole,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
        private readonly _displayName?: string,
    ) {}

    get id(): string {
        return this._id;
    }

    get email(): string {
        return this._email;
    }

    get passwordHash(): string {
        return this._passwordHash;
    }

    get role(): WorkerRole {
        return this._role;
    }

    get displayName(): string | undefined {
        return this._displayName;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    static mapToDomain(data: IWorkerData | null): WorkerEntity | null {
        return data
            ? new WorkerEntity(
                  data.id,
                  data.email,
                  data.passwordHash,
                  data.role,
                  data.createdAt,
                  data.updatedAt,
                  data.displayName,
              )
            : null;
    }
}

export class UserProgressEntity {
    constructor(
        private readonly _userId: string,
        private readonly _lessonId: number,
        private readonly _currentPageId: number,
        private readonly _status: string,
        private readonly _metadata: string,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
    ) {}

    get userId(): string {
        return this._userId;
    }

    get lessonId(): number {
        return this._lessonId;
    }

    get currentPageId(): number {
        return this._currentPageId;
    }

    get status(): string {
        return this._status;
    }

    get metadata(): string {
        return this._metadata;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }
}

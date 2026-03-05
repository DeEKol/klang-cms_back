import { LessonProgressOrmEntity, LessonStatus } from "../../modules/persistence/lesson-progress/lesson-progress.orm-entity";

export class LessonProgressEntity {
    constructor(
        private readonly _id: string,
        private readonly _userId: string,
        private readonly _lessonId: string,
        private readonly _status: LessonStatus,
        private readonly _currentPageNumber: number,
        private readonly _totalPagesViewed: number,
        private readonly _completionPercentage: number,
        private readonly _timeSpentSeconds: number,
        private readonly _lastViewedAt: Date,
        private readonly _completedAt: Date | null,
        private readonly _attempts: number,
        private readonly _score: number | null,
        private readonly _notes: string | null,
        private readonly _createdAt: Date,
        private readonly _updatedAt: Date,
    ) {}

    get id(): string {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get lessonId(): string {
        return this._lessonId;
    }

    get status(): LessonStatus {
        return this._status;
    }

    get currentPageNumber(): number {
        return this._currentPageNumber;
    }

    get totalPagesViewed(): number {
        return this._totalPagesViewed;
    }

    get completionPercentage(): number {
        return this._completionPercentage;
    }

    get timeSpentSeconds(): number {
        return this._timeSpentSeconds;
    }

    get lastViewedAt(): Date {
        return this._lastViewedAt;
    }

    get completedAt(): Date | null {
        return this._completedAt;
    }

    get attempts(): number {
        return this._attempts;
    }

    get score(): number | null {
        return this._score;
    }

    get notes(): string | null {
        return this._notes;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    // * Бизнес-логика: проверка завершенности урока
    isCompleted(): boolean {
        return this._status === LessonStatus.COMPLETED;
    }

    // * Бизнес-логика: проверка активного изучения
    isInProgress(): boolean {
        return this._status === LessonStatus.IN_PROGRESS;
    }

    // * Бизнес-логика: проверка что урок еще не начат
    isNotStarted(): boolean {
        return this._status === LessonStatus.NOT_STARTED;
    }

    static mapToDomain(ormEntity: LessonProgressOrmEntity): LessonProgressEntity {
        return new LessonProgressEntity(
            ormEntity.id,
            ormEntity.user.id,
            ormEntity.lesson.id,
            ormEntity.status,
            ormEntity.currentPageNumber,
            ormEntity.totalPagesViewed,
            ormEntity.completionPercentage,
            ormEntity.timeSpentSeconds,
            ormEntity.lastViewedAt,
            ormEntity.completedAt,
            ormEntity.attempts,
            ormEntity.score,
            ormEntity.notes,
            ormEntity.createdAt,
            ormEntity.updatedAt,
        );
    }
}

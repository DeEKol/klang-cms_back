import { LessonPageOrmEntity } from "../../modules/persistence/lesson-page/lesson-page.orm-entity";

export class LessonPageEntity {
    constructor(
        private readonly _id: string,
        private readonly _text: string,
        private readonly _pageNumber: number,
    ) {}

    get id(): string {
        return this._id;
    }

    get text(): string {
        return this._text;
    }

    get pageNumber(): number {
        return this._pageNumber;
    }

    static mapToDomain(lesson: LessonPageOrmEntity | null): LessonPageEntity | null {
        if (lesson) return new LessonPageEntity(lesson.id, lesson.text, lesson.pageNumber);
        else return null;
    }
}

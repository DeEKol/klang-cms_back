import { PageOrmEntity } from "../../modules/persistence/lesson-page/page.orm-entity";

export class PageEntity {
    constructor(
        private readonly _id: string,
        private readonly _text: string,
        private readonly _order: number,
    ) {}

    get id(): string {
        return this._id;
    }

    get text(): string {
        return this._text;
    }

    get order(): number {
        return this._order;
    }

    static mapToDomain(lesson: PageOrmEntity | null): PageEntity | null {
        if (lesson) return new PageEntity(lesson.id, lesson.text, lesson.order);
        else return null;
    }
}

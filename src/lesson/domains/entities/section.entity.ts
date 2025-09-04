import { LessonPageEntity } from "./lesson-page.entity";
import { LessonOrmEntity } from "../../modules/persistence/lesson/lesson.orm-entity";
import { SectionOrmEntity } from "../../modules/persistence/section/section.orm-entity";

export class SectionEntity {
    constructor(
        private readonly _id: string,
        private readonly _text: string,
    ) {}

    get id(): string {
        return this._id;
    }

    get text(): string {
        return this._text;
    }

    static mapToDomain(sectionOrmEntity: SectionOrmEntity | null): SectionEntity | null {
        if (sectionOrmEntity) return new SectionEntity(sectionOrmEntity.id, sectionOrmEntity.text);
        else return null;
    }
}

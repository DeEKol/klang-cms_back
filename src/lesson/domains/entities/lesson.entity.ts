import { LessonPageEntity } from "./lesson-page.entity";
import { LessonOrmEntity } from "../../modules/persistence/lesson/lesson.orm-entity";

export class LessonEntity {
    constructor(
        private readonly _id: string,
        private readonly _pages: LessonPageEntity[],
        private readonly _text: string,
    ) {}

    get id(): string {
        return this._id;
    }

    get pages(): LessonPageEntity[] {
        // * lesson-page[]
        return this._pages;
    }

    get text(): string {
        return this._text;
    }

    static mapToDomain(lessonOrmEntity: LessonOrmEntity | null): LessonEntity | null {
        const lessonPageArray = lessonOrmEntity?.lessonPages?.reduce((acc, lessonPage) => {
            const lessonPageEntity = LessonPageEntity.mapToDomain(lessonPage);
            if (lessonPageEntity) acc.push(lessonPageEntity);

            return acc;
        }, [] as LessonPageEntity[]);

        if (lessonOrmEntity && lessonPageArray)
            return new LessonEntity(lessonOrmEntity.id, lessonPageArray, lessonOrmEntity.text);
        else return null;
    }
}

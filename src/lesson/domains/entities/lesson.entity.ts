import { PageEntity } from "./page.entity";
import { LessonOrmEntity } from "../../modules/persistence/lesson/lesson.orm-entity";

export class LessonEntity {
    constructor(
        private readonly _id: string,
        private readonly _text: string,
        private readonly _number: number,
        private readonly _pages: PageEntity[],
    ) {}

    get id(): string {
        return this._id;
    }

    get pages(): PageEntity[] {
        // * lesson-page[]
        return this._pages;
    }

    get text(): string {
        return this._text;
    }

    get order(): number {
        return this._number;
    }

    static mapToDomain(lessonOrmEntity: LessonOrmEntity | null): LessonEntity | null {
        const lessonPageArray = lessonOrmEntity?.pages?.reduce((acc, page) => {
            const pageEntity = PageEntity.mapToDomain(page);
            if (pageEntity) acc.push(pageEntity);

            return acc;
        }, [] as PageEntity[]);

        if (lessonOrmEntity)
            return new LessonEntity(
                lessonOrmEntity.id,
                lessonOrmEntity.text,
                lessonOrmEntity.order,
                lessonPageArray ?? [],
            );
        else return null;
    }
}

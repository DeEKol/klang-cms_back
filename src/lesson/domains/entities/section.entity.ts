import { SectionOrmEntity } from "../../modules/persistence/section/section.orm-entity";
import { LessonEntity } from "./lesson.entity";

export class SectionEntity {
    constructor(
        private readonly _id: string,
        private readonly _text: string,
        private readonly _order: number,
        private readonly _lessons: LessonEntity[],
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

    get lessons(): LessonEntity[] {
        return this._lessons;
    }

    static mapToDomain(sectionOrmEntity: SectionOrmEntity | null): SectionEntity | null {
        const sectionLessonArray = sectionOrmEntity?.lessons?.reduce((acc, lesson) => {
            const lessonEntity = LessonEntity.mapToDomain(lesson);

            if (lessonEntity) acc.push(lessonEntity);

            return acc;
        }, [] as LessonEntity[]);

        if (sectionOrmEntity)
            return new SectionEntity(
                sectionOrmEntity.id,
                sectionOrmEntity.text,
                sectionOrmEntity.order,
                sectionLessonArray ?? [],
            );
        else return null;
    }
}

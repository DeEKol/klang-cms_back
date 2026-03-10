import { LessonEntity, ILessonData } from "./lesson.entity";

export interface ISectionData {
    id: string;
    text: string;
    order: number;
    lessons?: ILessonData[];
}

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

    static mapToDomain(data: ISectionData | null): SectionEntity | null {
        const sectionLessonArray = data?.lessons?.reduce((acc, lesson) => {
            const lessonEntity = LessonEntity.mapToDomain(lesson);

            if (lessonEntity) acc.push(lessonEntity);

            return acc;
        }, [] as LessonEntity[]);

        if (data)
            return new SectionEntity(data.id, data.text, data.order, sectionLessonArray ?? []);
        else return null;
    }
}

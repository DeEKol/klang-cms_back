import { PageEntity, IPageData } from "./page.entity";

export interface ILessonData {
    id: string;
    text: string;
    order: number;
    pages?: IPageData[];
}

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

    static mapToDomain(data: ILessonData | null): LessonEntity | null {
        const lessonPageArray = data?.pages?.reduce((acc, page) => {
            const pageEntity = PageEntity.mapToDomain(page);
            if (pageEntity) acc.push(pageEntity);

            return acc;
        }, [] as PageEntity[]);

        if (data) return new LessonEntity(data.id, data.text, data.order, lessonPageArray ?? []);
        else return null;
    }
}

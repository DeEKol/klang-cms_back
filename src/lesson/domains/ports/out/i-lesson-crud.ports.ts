import { LessonOrmEntity } from "../../../modules/persistence/lesson/lesson.orm-entity";
import { LessonPageOrmEntity } from "../../../modules/persistence/lesson-page/lesson-page.orm-entity";
import { SectionOrmEntity } from "../../../modules/persistence/section/section.orm-entity";

export type TSectionId = string;
export type TSectionText = string;
export type TLessonId = string;
export type TLessonText = string;
export type TPageId = string;
export type TPageText = string;
export type TPageNumber = number;

export interface ILessonCrudPorts {
    getSection(id: TSectionId): Promise<SectionOrmEntity | null>;
    getSections(): Promise<SectionOrmEntity[] | []>;
    createSection(text: TSectionText): Promise<SectionOrmEntity | null>;
    updateSection(id: TSectionId, text?: TSectionText): Promise<boolean>;
    deleteSection(id: TSectionId): Promise<boolean>;

    getLesson(id: TLessonId): Promise<LessonOrmEntity | null>;
    createLesson(text: TLessonText): Promise<LessonOrmEntity | null>;
    updateLesson(id: TLessonId, text?: TLessonText): Promise<boolean>;
    deleteLesson(id: TLessonId): Promise<boolean>;

    createPage(
        text: string,
        pageNumber: number,
        lessonId: string,
    ): Promise<LessonPageOrmEntity | null>;
    deletePage(id: TLessonId, pageNumber: TPageNumber): Promise<boolean>;
    updatePage(
        id: TPageId,
        pageNumber?: TPageNumber,
        text?: TPageText,
        lessonId?: TLessonId,
    ): Promise<boolean>;
}

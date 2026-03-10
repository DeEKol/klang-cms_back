import { LessonEntity } from "../../entities/lesson.entity";
import { PageEntity } from "../../entities/page.entity";
import { SectionEntity } from "../../entities/section.entity";

export type TSectionId = string;
export type TSectionText = string;
export type TLessonId = string;
export type TLessonText = string;
export type TPageId = string;
export type TPageText = string;
export type TPageNumber = number;

export interface ILessonCrudPorts {
    getSection(id: TSectionId): Promise<SectionEntity | null>;
    getSections(): Promise<SectionEntity[]>;
    createSection(text: TSectionText): Promise<SectionEntity | null>;
    updateSection(id: TSectionId, text?: TSectionText): Promise<boolean>;
    deleteSection(id: TSectionId): Promise<boolean>;

    getLesson(id: TLessonId): Promise<LessonEntity | null>;
    createLesson(text: TLessonText): Promise<LessonEntity | null>;
    updateLesson(id: TLessonId, text?: TLessonText): Promise<boolean>;
    deleteLesson(id: TLessonId): Promise<boolean>;

    createPage(text: string, pageNumber: number, lessonId: string): Promise<PageEntity | null>;
    deletePage(id: TPageId): Promise<boolean>;
    updatePage(
        id: TPageId,
        pageNumber?: TPageNumber,
        text?: TPageText,
        lessonId?: TLessonId,
    ): Promise<boolean>;
}

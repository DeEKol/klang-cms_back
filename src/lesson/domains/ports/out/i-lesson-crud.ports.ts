import { LessonOrmEntity } from "../../../modules/persistence/lesson/lesson.orm-entity";
import { LessonPageOrmEntity } from "../../../modules/persistence/lesson-page/lesson-page.orm-entity";
import { TLessonId, TLessonText, TPageId, TPageNumber, TPageText } from "../in/i-lesson.use-cases";

export interface ILessonCrudPorts {
    getLesson(id: TLessonId): Promise<LessonOrmEntity | null>;
    createLesson(text: TLessonText): Promise<LessonOrmEntity | null>;
    createPage(
        text: string,
        pageNumber: number,
        lessonId: string,
    ): Promise<LessonPageOrmEntity | null>;
    deleteLesson(id: TLessonId): Promise<boolean>;
    deletePage(id: TLessonId, pageNumber: TPageNumber): Promise<boolean>;
    updateLesson(id: TLessonId, text?: TLessonText): Promise<boolean>;
    updatePage(
        id: TPageId,
        pageNumber?: TPageNumber,
        text?: TPageText,
        lessonId?: TLessonId,
    ): Promise<boolean>;
}

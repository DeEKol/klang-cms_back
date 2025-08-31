import { LessonEntity } from "../../entities/lesson.entity";
import { LessonPageEntity } from "../../entities/lesson-page.entity";
import { GetLessonCommand } from "./get-lesson.command";
import { DeleteLessonCommand } from "./delete-lesson.command";
import { CreateLessonCommand } from "./create-lesson.command";
import { CreatePageCommand } from "./create-page.command";
import { DeletePageCommand } from "./delete-page.command";
import { UpdateLessonCommand } from "./update-lesson.command";
import { UpdatePageCommand } from "./update-page.command";

export type TLessonId = string;
export type TLessonText = string;
export type TPageId = string;
export type TPageText = string;
export type TPageNumber = number;

export const SLessonCrudUseCases = Symbol("LessonCrudUseCases");

export interface ILessonUseCases {
    getLesson(command: GetLessonCommand): Promise<LessonEntity | null>;
    createLesson(command: CreateLessonCommand): Promise<LessonEntity | null>;
    updateLesson(command: UpdateLessonCommand): Promise<boolean>;
    deleteLesson(command: DeleteLessonCommand): Promise<boolean>;
    createPage(command: CreatePageCommand): Promise<LessonPageEntity | null>;
    deletePage(command: DeletePageCommand): Promise<boolean>;
    updatePage(command: UpdatePageCommand): Promise<boolean>;
}

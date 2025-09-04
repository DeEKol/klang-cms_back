import { LessonEntity } from "../../entities/lesson.entity";
import { LessonPageEntity } from "../../entities/lesson-page.entity";
import { SectionEntity } from "../../entities/section.entity";
import { GetLessonCommand } from "./get-lesson.command";
import { DeleteLessonCommand } from "./delete-lesson.command";
import { CreateLessonCommand } from "./create-lesson.command";
import { CreatePageCommand } from "./create-page.command";
import { DeletePageCommand } from "./delete-page.command";
import { UpdateLessonCommand } from "./update-lesson.command";
import { UpdatePageCommand } from "./update-page.command";
import { GetSectionCommand } from "./get-section.command";
import { UpdateSectionCommand } from "./update-section.command";
import { DeleteSectionCommand } from "./delete-section.command";
import { CreateSectionCommand } from "./create-section.command";

export const SLessonCrudUseCases = Symbol("LessonCrudUseCases");

export interface ILessonUseCases {
    getSection(command: GetSectionCommand): Promise<SectionEntity | null>;
    getSections(): Promise<SectionEntity[] | []>;
    createSection(command: CreateSectionCommand): Promise<SectionEntity | null>;
    updateSection(command: UpdateSectionCommand): Promise<boolean>;
    deleteSection(command: DeleteSectionCommand): Promise<boolean>;

    getLesson(command: GetLessonCommand): Promise<LessonEntity | null>;
    createLesson(command: CreateLessonCommand): Promise<LessonEntity | null>;
    updateLesson(command: UpdateLessonCommand): Promise<boolean>;
    deleteLesson(command: DeleteLessonCommand): Promise<boolean>;

    createPage(command: CreatePageCommand): Promise<LessonPageEntity | null>;
    deletePage(command: DeletePageCommand): Promise<boolean>;
    updatePage(command: UpdatePageCommand): Promise<boolean>;
}

import { Result } from "@infrastructure/result/result";
import { NotFoundError } from "@infrastructure/errors/domain-errors";
import { LessonEntity } from "../../entities/lesson.entity";
import { PageEntity } from "../../entities/page.entity";
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
    getSection(command: GetSectionCommand): Promise<Result<SectionEntity, NotFoundError>>;
    getSections(): Promise<SectionEntity[]>;
    createSection(command: CreateSectionCommand): Promise<SectionEntity>;
    updateSection(command: UpdateSectionCommand): Promise<Result<true, NotFoundError>>;
    deleteSection(command: DeleteSectionCommand): Promise<Result<true, NotFoundError>>;

    getLesson(command: GetLessonCommand): Promise<Result<LessonEntity, NotFoundError>>;
    createLesson(command: CreateLessonCommand): Promise<LessonEntity>;
    updateLesson(command: UpdateLessonCommand): Promise<Result<true, NotFoundError>>;
    deleteLesson(command: DeleteLessonCommand): Promise<Result<true, NotFoundError>>;

    createPage(command: CreatePageCommand): Promise<PageEntity>;
    updatePage(command: UpdatePageCommand): Promise<Result<true, NotFoundError>>;
    deletePage(command: DeletePageCommand): Promise<Result<true, NotFoundError>>;
}

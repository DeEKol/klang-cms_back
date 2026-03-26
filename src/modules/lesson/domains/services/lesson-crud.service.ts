import { Result } from "@infrastructure/result/result";
import { NotFoundError } from "@infrastructure/errors/domain-errors";
import { PageEntity } from "../entities/page.entity";
import { LessonEntity } from "../entities/lesson.entity";
import { SectionEntity } from "../entities/section.entity";
import { ILessonUseCases } from "../ports/in/i-lesson.use-cases";
import { GetLessonCommand } from "../ports/in/get-lesson.command";
import { DeleteLessonCommand } from "../ports/in/delete-lesson.command";
import { CreateLessonCommand } from "../ports/in/create-lesson.command";
import { CreatePageCommand } from "../ports/in/create-page.command";
import { DeletePageCommand } from "../ports/in/delete-page.command";
import { UpdatePageCommand } from "../ports/in/update-page.command";
import { UpdateLessonCommand } from "../ports/in/update-lesson.command";
import { ILessonCrudPorts } from "../ports/out/i-lesson-crud.port";
import { GetSectionCommand } from "../ports/in/get-section.command";
import { DeleteSectionCommand } from "../ports/in/delete-section.command";
import { CreateSectionCommand } from "../ports/in/create-section.command";
import { UpdateSectionCommand } from "../ports/in/update-section.command";

export class LessonCrudService implements ILessonUseCases {
    constructor(private readonly _lessonCrudPorts: ILessonCrudPorts) {}

    async getSection(command: GetSectionCommand): Promise<Result<SectionEntity, NotFoundError>> {
        const data = await this._lessonCrudPorts.getSection(command.id);
        const section = SectionEntity.mapToDomain(data);

        if (!section) return Result.err(new NotFoundError(`Section ${command.id} not found`));
        return Result.ok(section);
    }

    async getSections(): Promise<SectionEntity[]> {
        const items = await this._lessonCrudPorts.getSections();

        return items.reduce((acc, item) => {
            const section = SectionEntity.mapToDomain(item);
            if (section) acc.push(section);
            return acc;
        }, [] as SectionEntity[]);
    }

    async createSection(command: CreateSectionCommand): Promise<SectionEntity> {
        const data = await this._lessonCrudPorts.createSection(command.text);
        return SectionEntity.mapToDomain(data) as SectionEntity;
    }

    async updateSection(command: UpdateSectionCommand): Promise<Result<true, NotFoundError>> {
        const ok = await this._lessonCrudPorts.updateSection(command.id, command?.text);
        return ok
            ? Result.ok(true)
            : Result.err(new NotFoundError(`Section ${command.id} not found`));
    }

    async deleteSection(command: DeleteSectionCommand): Promise<Result<true, NotFoundError>> {
        const ok = await this._lessonCrudPorts.deleteSection(command.id);
        return ok
            ? Result.ok(true)
            : Result.err(new NotFoundError(`Section ${command.id} not found`));
    }

    async getLesson(command: GetLessonCommand): Promise<Result<LessonEntity, NotFoundError>> {
        const data = await this._lessonCrudPorts.getLesson(command.id);
        const lesson = LessonEntity.mapToDomain(data);

        if (!lesson) return Result.err(new NotFoundError(`Lesson ${command.id} not found`));
        return Result.ok(lesson);
    }

    async createLesson(command: CreateLessonCommand): Promise<LessonEntity> {
        const data = await this._lessonCrudPorts.createLesson(command.text);
        return LessonEntity.mapToDomain(data) as LessonEntity;
    }

    async updateLesson(command: UpdateLessonCommand): Promise<Result<true, NotFoundError>> {
        const ok = await this._lessonCrudPorts.updateLesson(command.id, command?.text);
        return ok
            ? Result.ok(true)
            : Result.err(new NotFoundError(`Lesson ${command.id} not found`));
    }

    async deleteLesson(command: DeleteLessonCommand): Promise<Result<true, NotFoundError>> {
        const ok = await this._lessonCrudPorts.deleteLesson(command.id);
        return ok
            ? Result.ok(true)
            : Result.err(new NotFoundError(`Lesson ${command.id} not found`));
    }

    async createPage(command: CreatePageCommand): Promise<PageEntity> {
        const data = await this._lessonCrudPorts.createPage(
            command.text,
            command.pageNumber,
            command.lessonId,
        );
        return PageEntity.mapToDomain(data) as PageEntity;
    }

    async updatePage(command: UpdatePageCommand): Promise<Result<true, NotFoundError>> {
        const ok = await this._lessonCrudPorts.updatePage(
            command.id,
            command?.pageNumber,
            command?.text,
            command?.lessonId,
        );
        return ok ? Result.ok(true) : Result.err(new NotFoundError(`Page ${command.id} not found`));
    }

    async deletePage(command: DeletePageCommand): Promise<Result<true, NotFoundError>> {
        const ok = await this._lessonCrudPorts.deletePage(command.id);
        return ok ? Result.ok(true) : Result.err(new NotFoundError(`Page ${command.id} not found`));
    }
}

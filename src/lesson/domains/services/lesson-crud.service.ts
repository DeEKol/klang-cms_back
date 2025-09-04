import { LessonPageEntity } from "../entities/lesson-page.entity";
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
import { ILessonCrudPorts } from "../ports/out/i-lesson-crud.ports";
import { GetSectionCommand } from "../ports/in/get-section.command";
import { DeleteSectionCommand } from "../ports/in/delete-section.command";
import { CreateSectionCommand } from "../ports/in/create-section.command";
import { UpdateSectionCommand } from "../ports/in/update-section.command";
import { SectionOrmEntity } from "../../modules/persistence/section/section.orm-entity";

export class LessonCrudService implements ILessonUseCases {
    constructor(private readonly _lessonCrudPorts: ILessonCrudPorts) {}

    async getSection(command: GetSectionCommand): Promise<SectionEntity | null> {
        const sectionOrmEntity = await this._lessonCrudPorts.getSection(command.id);

        return SectionEntity.mapToDomain(sectionOrmEntity);
    }

    async getSections(): Promise<SectionEntity[] | []> {
        const sectionOrmEntities: SectionOrmEntity[] | [] =
            await this._lessonCrudPorts.getSections();

        return sectionOrmEntities.reduce((acc, sectionOrmEntity) => {
            const sectionEntity = SectionEntity.mapToDomain(sectionOrmEntity);

            if (sectionEntity) acc.push(sectionEntity);

            return acc;
        }, [] as SectionEntity[]);
    }

    async createSection(command: CreateSectionCommand): Promise<SectionEntity | null> {
        const sectionOrmEntity = await this._lessonCrudPorts.createSection(command.text);

        return SectionEntity.mapToDomain(sectionOrmEntity);
    }

    deleteSection(command: DeleteSectionCommand): Promise<boolean> {
        return this._lessonCrudPorts.deleteSection(command.id);
    }

    updateSection(command: UpdateSectionCommand): Promise<boolean> {
        return this._lessonCrudPorts.updateSection(command.id, command?.text);
    }

    async getLesson(command: GetLessonCommand): Promise<LessonEntity | null> {
        const lessonOrmEntity = await this._lessonCrudPorts.getLesson(command.id);

        return LessonEntity.mapToDomain(lessonOrmEntity);
    }

    async createLesson(command: CreateLessonCommand): Promise<LessonEntity | null> {
        const lessonOrmEntity = await this._lessonCrudPorts.createLesson(command.text);

        return LessonEntity.mapToDomain(lessonOrmEntity);
    }

    updateLesson(command: UpdateLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.updateLesson(command.id, command?.text);
    }

    deleteLesson(command: DeleteLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.deleteLesson(command.id);
    }

    async createPage(command: CreatePageCommand): Promise<LessonPageEntity | null> {
        const lessonPageOrmEntity = await this._lessonCrudPorts.createPage(
            command.text,
            command.pageNumber,
            command.lessonId,
        );

        return LessonPageEntity.mapToDomain(lessonPageOrmEntity);
    }

    updatePage(command: UpdatePageCommand): Promise<boolean> {
        return this._lessonCrudPorts.updatePage(
            command.id,
            command?.pageNumber,
            command?.text,
            command?.lessonId,
        );
    }

    deletePage(command: DeletePageCommand): Promise<boolean> {
        return this._lessonCrudPorts.deletePage(command.lessonId, command.pageNumber);
    }
}

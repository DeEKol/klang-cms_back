import { ILessonUseCases } from "../ports/in/i-lesson.use-cases";
import { LessonPageEntity } from "../entities/lesson-page.entity";
import { LessonEntity } from "../entities/lesson.entity";
import { GetLessonCommand } from "../ports/in/get-lesson.command";
import { DeleteLessonCommand } from "../ports/in/delete-lesson.command";
import { CreateLessonCommand } from "../ports/in/create-lesson.command";
import { CreatePageCommand } from "../ports/in/create-page.command";
import { DeletePageCommand } from "../ports/in/delete-page.command";
import { UpdatePageCommand } from "../ports/in/update-page.command";
import { UpdateLessonCommand } from "../ports/in/update-lesson.command";
import { ILessonCrudPorts } from "../ports/out/i-lesson-crud.ports";

export class LessonCrudService implements ILessonUseCases {
    constructor(private readonly _lessonCrudPorts: ILessonCrudPorts) {}

    async getLesson(command: GetLessonCommand): Promise<LessonEntity | null> {
        const lessonOrmEntity = await this._lessonCrudPorts.getLesson(command.id);

        return LessonEntity.mapToDomain(lessonOrmEntity);
    }

    deleteLesson(command: DeleteLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.deleteLesson(command.id);
    }

    async createLesson(command: CreateLessonCommand): Promise<LessonEntity | null> {
        const lessonOrmEntity = await this._lessonCrudPorts.createLesson(command.text);

        return LessonEntity.mapToDomain(lessonOrmEntity);
    }

    async createPage(command: CreatePageCommand): Promise<LessonPageEntity | null> {
        const lessonPageOrmEntity = await this._lessonCrudPorts.createPage(
            command.text,
            command.pageNumber,
            command.lessonId,
        );

        return LessonPageEntity.mapToDomain(lessonPageOrmEntity);
    }

    deletePage(command: DeletePageCommand): Promise<boolean> {
        return this._lessonCrudPorts.deletePage(command.lessonId, command.pageNumber);
    }

    updateLesson(command: UpdateLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.updateLesson(command.id, command?.text);
    }

    updatePage(command: UpdatePageCommand): Promise<boolean> {
        return this._lessonCrudPorts.updatePage(
            command.id,
            command?.pageNumber,
            command?.text,
            command?.lessonId,
        );
    }
}

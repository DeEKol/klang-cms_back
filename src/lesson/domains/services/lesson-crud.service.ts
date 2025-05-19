import { ILessonCrudUseCases } from "../ports/in/i-lesson-crud.use-cases";
import { ILessonCrudPorts } from "../ports/out/i-lesson-crud.ports";
import { SaveLessonCommand } from "../ports/in/save-lesson.command";
import { LessonEntity } from "../entities/lesson.entity";
import { UpdateLessonCommand } from "../ports/in/update-lesson.command";

export class LessonCrudService implements ILessonCrudUseCases {
    constructor(private readonly _lessonCrudPorts: ILessonCrudPorts) {}

    async findLesson(id: number): Promise<LessonEntity | null> {
        const lessonEntity = await this._lessonCrudPorts.loadLesson(id);
        return lessonEntity !== null ? lessonEntity : null;
    }

    findLessonArray(): Promise<LessonEntity[]> {
        return this._lessonCrudPorts.loadLessonArray();
    }

    saveLesson(lesson: SaveLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.createLesson(SaveLessonCommand.of(lesson));
    }

    updateLesson(lesson: UpdateLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.updateLesson(lesson);
    }

    deleteLesson(id: string): Promise<boolean> {
        return this._lessonCrudPorts.deleteLesson(id);
    }
}

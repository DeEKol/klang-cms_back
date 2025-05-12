import { ILessonCrudUseCases } from "../ports/in/i-lesson-crud.use-cases";
import { ILessonCrudPorts } from "../ports/out/i-lesson-crud.ports";
import { SaveLessonCommand } from "../ports/in/save-lesson.command";
import { LessonEntity } from "../entities/lesson.entity";

export class LessonCrudService implements ILessonCrudUseCases {
    constructor(private readonly _lessonCrudPorts: ILessonCrudPorts) {}

    findLessonArray(): Promise<LessonEntity[]> {
        return this._lessonCrudPorts.loadLessonArray();
    }

    saveLesson(lesson: SaveLessonCommand): Promise<boolean> {
        return this._lessonCrudPorts.createLesson(SaveLessonCommand.of(lesson));
    }
}

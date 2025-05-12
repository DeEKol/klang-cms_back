import { SaveLessonCommand } from "./save-lesson.command";
import { LessonEntity } from "../../entities/lesson.entity";

export const SLessonCrudUseCases = Symbol("LessonCrudUseCases");

export interface ILessonCrudUseCases {
    findLessonArray(): Promise<LessonEntity[]>;
    saveLesson(command: SaveLessonCommand): Promise<boolean>;
}

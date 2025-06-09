import { SaveLessonCommand } from "./save-lesson.command";
import { LessonEntity } from "../../entities/lesson.entity";
import { UpdateLessonCommand } from "./update-lesson.command";

export const SLessonCrudUseCases = Symbol("LessonCrudUseCases");

export interface ILessonCrudUseCases {
    findLesson(id: string): Promise<LessonEntity | null>;
    findLessonArray(): Promise<LessonEntity[]>;
    saveLesson(command: SaveLessonCommand): Promise<boolean>;
    updateLesson(command: UpdateLessonCommand): Promise<boolean>;
    deleteLesson(id: string): Promise<boolean>;
}

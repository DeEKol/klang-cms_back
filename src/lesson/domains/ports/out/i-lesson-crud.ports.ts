import { LessonEntity } from "../../entities/lesson.entity";
import { SaveLessonCommand } from "../in/save-lesson.command";
import { UpdateLessonCommand } from "../in/update-lesson.command";

export interface ILessonCrudPorts {
    loadLesson(id: number): Promise<LessonEntity | null>;
    loadLessonArray(): Promise<LessonEntity[]>;
    createLesson(lesson: SaveLessonCommand): Promise<boolean>;
    updateLesson(lesson: UpdateLessonCommand): Promise<boolean>;
    deleteLesson(id: string): Promise<boolean>;
}

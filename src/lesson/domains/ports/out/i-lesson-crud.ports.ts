import { LessonEntity } from "../../entities/lesson.entity";
import { SaveLessonCommand } from "../in/save-lesson.command";

export interface ILessonCrudPorts {
    loadLessonArray(): Promise<LessonEntity[]>;
    createLesson(lesson: SaveLessonCommand): Promise<boolean>;
}

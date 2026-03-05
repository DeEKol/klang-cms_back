import { LessonProgressEntity } from "../../entities/lesson-progress.entity";
import { CreateLessonProgressCommand } from "./create-lesson-progress.command";
import { UpdateLessonProgressCommand } from "./update-lesson-progress.command";
import { DeleteLessonProgressCommand } from "./delete-lesson-progress.command";
import { GetLessonProgressCommand } from "./get-lesson-progress.command";

export const SLessonProgressUseCases = Symbol("ILessonProgressUseCases");

export interface ILessonProgressUseCases {
    create(command: CreateLessonProgressCommand): Promise<LessonProgressEntity>;
    update(command: UpdateLessonProgressCommand): Promise<boolean>;
    delete(command: DeleteLessonProgressCommand): Promise<boolean>;
    get(command: GetLessonProgressCommand): Promise<LessonProgressEntity | null>;

    // * Кастомные методы
    getProgressByUserAndLesson(
        userId: string,
        lessonId: string,
    ): Promise<LessonProgressEntity | null>;
    getUserStatistics(userId: string): Promise<LessonProgressEntity[]>;
}

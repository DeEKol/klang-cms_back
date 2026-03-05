import { LessonProgressOrmEntity } from "../../../modules/persistence/lesson-progress/lesson-progress.orm-entity";

export interface ILessonProgressRepository {
    findById(id: string): Promise<LessonProgressOrmEntity | null>;
    create(lessonProgress: Partial<LessonProgressOrmEntity>): Promise<LessonProgressOrmEntity>;
    update(id: string, lessonProgress: Partial<LessonProgressOrmEntity>): Promise<boolean>;
    delete(id: string): Promise<boolean>;

    // * Кастомные методы
    findByUserAndLesson(userId: string, lessonId: string): Promise<LessonProgressOrmEntity | null>;
    findAllByUser(userId: string): Promise<LessonProgressOrmEntity[]>;
}

import { LessonEntity } from "../../domains/entities/lesson.entity";
import { LessonOrmEntity } from "./lesson.orm-entity";

export class LessonMapper {
    static mapToDomain(lesson: LessonOrmEntity): LessonEntity {
        return new LessonEntity(lesson.idPk, lesson.id, lesson.text);
    }

    static mapFromEntityToOrmEntity(lesson: LessonEntity): LessonOrmEntity {
        const lessonOrmEntity = new LessonOrmEntity();

        lessonOrmEntity.text = lesson.text;

        if (lesson.id !== null) lessonOrmEntity.id = lesson.id;

        return lessonOrmEntity;
    }
}

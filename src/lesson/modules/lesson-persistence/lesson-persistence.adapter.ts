import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonOrmEntity } from "./lesson.orm-entity";
import { ILessonCrudPorts } from "../../domains/ports/out/i-lesson-crud.ports";
import { LessonEntity } from "../../domains/entities/lesson.entity";
import { LessonMapper } from "./lesson.mapper";
import { SaveLessonCommand } from "../../domains/ports/in/save-lesson.command";

@Injectable()
export class LessonPersistenceAdapter implements ILessonCrudPorts {
    constructor(
        @InjectRepository(LessonOrmEntity)
        private readonly _lessonRepository: Repository<LessonOrmEntity>,
    ) {}

    async loadLessonArray(): Promise<LessonEntity[]> {
        const lessonOrmEntityArray = await this._lessonRepository.find();
        return lessonOrmEntityArray.map((lessonOrmEntity) => {
            return LessonMapper.mapToDomain(lessonOrmEntity);
        });
    }

    async createLesson(lesson: SaveLessonCommand): Promise<boolean> {
        await this._lessonRepository.save(lesson);

        return true;
    }
}

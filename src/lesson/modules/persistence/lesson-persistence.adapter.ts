import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonOrmEntity } from "./lesson/lesson.orm-entity";
import { LessonPageOrmEntity } from "./lesson-page/lesson-page.orm-entity";
import { ILessonCrudPorts } from "../../domains/ports/out/i-lesson-crud.ports";

@Injectable()
export class LessonPersistenceAdapter implements ILessonCrudPorts {
    constructor(
        @InjectRepository(LessonOrmEntity)
        private readonly _lessonRepository: Repository<LessonOrmEntity>,
        @InjectRepository(LessonPageOrmEntity)
        private readonly _lessonPageRepository: Repository<LessonPageOrmEntity>,
    ) {}

    getLesson(id: string): Promise<LessonOrmEntity | null> {
        return this._lessonRepository.findOne({
            where: { id: id },
            relations: ["lessonPages"],
        });
    }

    async deleteLesson(id: string): Promise<boolean> {
        const lessonOrmEntity = await this.getLesson(id);

        if (lessonOrmEntity) {
            await this._lessonPageRepository.remove(lessonOrmEntity?.lessonPages);

            const removedLesson = await this._lessonRepository.remove(lessonOrmEntity);

            return !!removedLesson;
        }

        return false;
    }

    async createLesson(text: string): Promise<LessonOrmEntity | null> {
        const lessonOrmEntity = new LessonOrmEntity();
        lessonOrmEntity.text = text;

        return await this._lessonRepository.save(lessonOrmEntity);
    }

    async createPage(
        text: string,
        pageNumber: number,
        lessonId: string,
    ): Promise<LessonPageOrmEntity | null> {
        const lessonOrmEntity = await this.getLesson(lessonId);

        if (lessonOrmEntity) {
            const lessonPageOrmEntity = new LessonPageOrmEntity();
            lessonPageOrmEntity.text = text;
            lessonPageOrmEntity.pageNumber = pageNumber;
            lessonPageOrmEntity.lesson = lessonOrmEntity;

            return await this._lessonPageRepository.save(lessonPageOrmEntity);
        }

        return null;
    }

    async deletePage(lessonId: string, pageNumber: number): Promise<boolean> {
        const lessonOrmEntity = await this.getLesson(lessonId);

        if (lessonOrmEntity) {
            const lessonPageOrmEntity = await this._lessonPageRepository.findBy({
                lesson: lessonOrmEntity,
                pageNumber: pageNumber,
            });

            const removedPage = await this._lessonPageRepository.remove(lessonPageOrmEntity);

            return !!removedPage;
        }

        return false;
    }

    async updateLesson(id: string, text?: string): Promise<boolean> {
        const lessonOrmEntity = new LessonOrmEntity();
        if (text) lessonOrmEntity.text = text;

        const updatedLesson = await this._lessonRepository.update({ id }, lessonOrmEntity);

        return !!updatedLesson.affected;
    }

    async updatePage(
        id: string,
        pageNumber?: number,
        text?: string,
        lessonId?: string,
    ): Promise<boolean> {
        const lessonPageOrmEntity = new LessonPageOrmEntity();
        if (pageNumber) lessonPageOrmEntity.pageNumber = pageNumber;
        if (text) lessonPageOrmEntity.text = text;

        if (lessonId) {
            const lessonOrmEntity = await this.getLesson(lessonId);

            if (lessonOrmEntity) lessonPageOrmEntity.lesson = lessonOrmEntity;
        }

        const updatedPage = await this._lessonPageRepository.update({ id }, lessonPageOrmEntity);

        return !!updatedPage.affected;
    }
}

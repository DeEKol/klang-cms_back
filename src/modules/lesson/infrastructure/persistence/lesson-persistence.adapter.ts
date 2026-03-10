import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonOrmEntity } from "./lesson/lesson.orm-entity";
import { PageOrmEntity } from "./lesson-page/page.orm-entity";
import {
    ILessonCrudPorts,
    TSectionId,
    TSectionText,
    TLessonId,
    TLessonText,
    TPageId,
    TPageNumber,
    TPageText,
} from "../../domains/ports/out/i-lesson-crud.port";
import { SectionOrmEntity } from "./section/section.orm-entity";
import { SectionEntity } from "../../domains/entities/section.entity";
import { LessonEntity } from "../../domains/entities/lesson.entity";
import { PageEntity } from "../../domains/entities/page.entity";

@Injectable()
export class LessonPersistenceAdapter implements ILessonCrudPorts {
    constructor(
        @InjectRepository(SectionOrmEntity)
        private readonly _sectionRepository: Repository<SectionOrmEntity>,
        @InjectRepository(LessonOrmEntity)
        private readonly _lessonRepository: Repository<LessonOrmEntity>,
        @InjectRepository(PageOrmEntity)
        private readonly _lessonPageRepository: Repository<PageOrmEntity>,
    ) {}

    private getSectionOrm(id: TSectionId): Promise<SectionOrmEntity | null> {
        return this._sectionRepository.findOne({
            where: { id },
            relations: ["lessons"],
        });
    }

    async getSection(id: TSectionId): Promise<SectionEntity | null> {
        const orm = await this.getSectionOrm(id);
        return SectionEntity.mapToDomain(orm);
    }

    async getSections(): Promise<SectionEntity[]> {
        const orms = await this._sectionRepository.find({
            relations: ["lessons"],
        });
        return orms.reduce((acc, orm) => {
            const entity = SectionEntity.mapToDomain(orm);
            if (entity) acc.push(entity);
            return acc;
        }, [] as SectionEntity[]);
    }

    async createSection(text: TSectionText): Promise<SectionEntity | null> {
        const sectionOrmEntity = new SectionOrmEntity();
        sectionOrmEntity.text = text;
        const saved = await this._sectionRepository.save(sectionOrmEntity);
        return SectionEntity.mapToDomain(saved);
    }

    async updateSection(id: TSectionId, text?: TSectionText): Promise<boolean> {
        const sectionOrmEntity = new SectionOrmEntity();
        if (text) sectionOrmEntity.text = text;

        const updatedSection = await this._sectionRepository.update({ id }, sectionOrmEntity);

        return !!updatedSection.affected;
    }

    async deleteSection(id: TSectionId): Promise<boolean> {
        const sectionOrmEntity = await this.getSectionOrm(id);

        if (sectionOrmEntity) {
            for (const lesson of sectionOrmEntity.lessons) {
                if (lesson) await this._lessonPageRepository.remove(lesson.pages);
            }

            await this._lessonRepository.remove(sectionOrmEntity?.lessons);

            const removedSection = await this._sectionRepository.remove(sectionOrmEntity);

            return !!removedSection;
        }

        return false;
    }

    private getLessonOrm(id: TLessonId): Promise<LessonOrmEntity | null> {
        return this._lessonRepository.findOne({
            where: { id },
            relations: ["pages"],
        });
    }

    async getLesson(id: TLessonId): Promise<LessonEntity | null> {
        const orm = await this.getLessonOrm(id);
        return LessonEntity.mapToDomain(orm);
    }

    async createLesson(text: TLessonText): Promise<LessonEntity | null> {
        const lessonOrmEntity = new LessonOrmEntity();
        lessonOrmEntity.text = text;
        const saved = await this._lessonRepository.save(lessonOrmEntity);
        return LessonEntity.mapToDomain(saved);
    }

    async updateLesson(id: TLessonId, text?: TLessonText): Promise<boolean> {
        const lessonOrmEntity = new LessonOrmEntity();
        if (text) lessonOrmEntity.text = text;

        const updatedLesson = await this._lessonRepository.update({ id }, lessonOrmEntity);

        return !!updatedLesson.affected;
    }

    async deleteLesson(id: TLessonId): Promise<boolean> {
        const lessonOrmEntity = await this.getLessonOrm(id);

        if (lessonOrmEntity) {
            await this._lessonPageRepository.remove(lessonOrmEntity?.pages);

            const removedLesson = await this._lessonRepository.remove(lessonOrmEntity);

            return !!removedLesson;
        }

        return false;
    }

    async createPage(
        text: string,
        pageNumber: number,
        lessonId: string,
    ): Promise<PageEntity | null> {
        const lessonOrmEntity = await this.getLessonOrm(lessonId);

        if (lessonOrmEntity) {
            const lessonPageOrmEntity = new PageOrmEntity();
            lessonPageOrmEntity.text = text;
            lessonPageOrmEntity.order = pageNumber;
            lessonPageOrmEntity.lesson = lessonOrmEntity;

            const saved = await this._lessonPageRepository.save(lessonPageOrmEntity);
            return PageEntity.mapToDomain(saved);
        }

        return null;
    }

    async updatePage(
        id: TPageId,
        pageNumber?: TPageNumber,
        text?: TPageText,
        lessonId?: TLessonId,
    ): Promise<boolean> {
        const lessonPageOrmEntity = new PageOrmEntity();
        if (pageNumber) lessonPageOrmEntity.order = pageNumber;
        if (text) lessonPageOrmEntity.text = text;

        if (lessonId) {
            const lessonOrmEntity = await this.getLessonOrm(lessonId);

            if (lessonOrmEntity) lessonPageOrmEntity.lesson = lessonOrmEntity;
        }

        const updatedPage = await this._lessonPageRepository.update({ id }, lessonPageOrmEntity);

        return !!updatedPage.affected;
    }

    private getPageOrm(id: TPageId): Promise<PageOrmEntity | null> {
        return this._lessonPageRepository.findOne({
            where: { id },
        });
    }

    async deletePage(id: TPageId): Promise<boolean> {
        const pageOrmEntity = await this.getPageOrm(id);

        if (pageOrmEntity) {
            const removedPage = await this._lessonPageRepository.remove(pageOrmEntity);

            return !!removedPage;
        }

        return false;
    }
}

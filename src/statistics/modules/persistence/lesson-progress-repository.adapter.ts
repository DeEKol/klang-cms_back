import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ILessonProgressRepository } from "../../domains/ports/out/i-lesson-progress-repository.port";
import { LessonProgressOrmEntity } from "./lesson-progress/lesson-progress.orm-entity";
import { UserOrmEntity } from "../../../auth/modules/persistence/user/user.orm-entity";
import { LessonOrmEntity } from "../../../lesson/modules/persistence/lesson/lesson.orm-entity";

@Injectable()
export class LessonProgressRepositoryAdapter implements ILessonProgressRepository {
    constructor(
        @InjectRepository(LessonProgressOrmEntity)
        private readonly lessonProgressRepository: Repository<LessonProgressOrmEntity>,
        @InjectRepository(UserOrmEntity)
        private readonly userRepository: Repository<UserOrmEntity>,
        @InjectRepository(LessonOrmEntity)
        private readonly lessonRepository: Repository<LessonOrmEntity>,
    ) {}

    async findById(id: string): Promise<LessonProgressOrmEntity | null> {
        return this.lessonProgressRepository.findOne({
            where: { id },
            relations: ["user", "lesson"],
        });
    }

    async create(
        lessonProgress: Partial<LessonProgressOrmEntity>,
    ): Promise<LessonProgressOrmEntity> {
        // Find user and lesson entities
        const user = await this.userRepository.findOne({
            where: { id: (lessonProgress.user as any).id },
        });
        if (!user) {
            throw new Error(`User with id ${(lessonProgress.user as any).id} not found`);
        }

        const lesson = await this.lessonRepository.findOne({
            where: { id: (lessonProgress.lesson as any).id },
        });
        if (!lesson) {
            throw new Error(`Lesson with id ${(lessonProgress.lesson as any).id} not found`);
        }

        // Create progress entity
        const progressEntity = this.lessonProgressRepository.create({
            ...lessonProgress,
            user,
            lesson,
        });

        // Save and return with relations
        const saved = await this.lessonProgressRepository.save(progressEntity);
        return this.findById(saved.id) as Promise<LessonProgressOrmEntity>;
    }

    async update(id: string, lessonProgress: Partial<LessonProgressOrmEntity>): Promise<boolean> {
        const existing = await this.lessonProgressRepository.findOne({ where: { id } });
        if (!existing) {
            return false;
        }

        // Update only provided fields
        Object.keys(lessonProgress).forEach((key) => {
            if (lessonProgress[key as keyof LessonProgressOrmEntity] !== undefined) {
                (existing as any)[key] = lessonProgress[key as keyof LessonProgressOrmEntity];
            }
        });

        await this.lessonProgressRepository.save(existing);
        return true;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.lessonProgressRepository.delete({ id });
        return (result.affected ?? 0) > 0;
    }

    async findByUserAndLesson(
        userId: string,
        lessonId: string,
    ): Promise<LessonProgressOrmEntity | null> {
        return this.lessonProgressRepository.findOne({
            where: {
                user: { id: userId },
                lesson: { id: lessonId },
            },
            relations: ["user", "lesson"],
        });
    }

    async findAllByUser(userId: string): Promise<LessonProgressOrmEntity[]> {
        return this.lessonProgressRepository.find({
            where: { user: { id: userId } },
            relations: ["user", "lesson"],
            order: { updatedAt: "DESC" },
        });
    }
}

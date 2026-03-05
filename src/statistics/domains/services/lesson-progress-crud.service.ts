import { ILessonProgressUseCases } from "../ports/in/i-lesson-progress.use-cases";
import { ILessonProgressRepository } from "../ports/out/i-lesson-progress-repository.port";
import { LessonProgressEntity } from "../entities/lesson-progress.entity";
import { CreateLessonProgressCommand } from "../ports/in/create-lesson-progress.command";
import { UpdateLessonProgressCommand } from "../ports/in/update-lesson-progress.command";
import { DeleteLessonProgressCommand } from "../ports/in/delete-lesson-progress.command";
import { GetLessonProgressCommand } from "../ports/in/get-lesson-progress.command";

export class LessonProgressCrudService implements ILessonProgressUseCases {
    constructor(private readonly repository: ILessonProgressRepository) {}

    async create(command: CreateLessonProgressCommand): Promise<LessonProgressEntity> {
        const ormEntity = await this.repository.create({
            user: { id: command.userId } as any,
            lesson: { id: command.lessonId } as any,
            status: command.status,
            currentPageNumber: command.currentPageNumber,
            totalPagesViewed: command.totalPagesViewed,
            completionPercentage: command.completionPercentage,
            timeSpentSeconds: command.timeSpentSeconds,
            lastViewedAt: command.lastViewedAt,
            completedAt: command.completedAt,
            attempts: command.attempts,
            score: command.score,
            notes: command.notes,
        });

        return LessonProgressEntity.mapToDomain(ormEntity);
    }

    async update(command: UpdateLessonProgressCommand): Promise<boolean> {
        const updateData: any = {};

        if (command.status !== undefined) updateData.status = command.status;
        if (command.currentPageNumber !== undefined)
            updateData.currentPageNumber = command.currentPageNumber;
        if (command.totalPagesViewed !== undefined)
            updateData.totalPagesViewed = command.totalPagesViewed;
        if (command.completionPercentage !== undefined)
            updateData.completionPercentage = command.completionPercentage;
        if (command.timeSpentSeconds !== undefined)
            updateData.timeSpentSeconds = command.timeSpentSeconds;
        if (command.lastViewedAt !== undefined) updateData.lastViewedAt = command.lastViewedAt;
        if (command.completedAt !== undefined) updateData.completedAt = command.completedAt;
        if (command.attempts !== undefined) updateData.attempts = command.attempts;
        if (command.score !== undefined) updateData.score = command.score;
        if (command.notes !== undefined) updateData.notes = command.notes;

        return this.repository.update(command.id, updateData);
    }

    async delete(command: DeleteLessonProgressCommand): Promise<boolean> {
        return this.repository.delete(command.id);
    }

    async get(command: GetLessonProgressCommand): Promise<LessonProgressEntity | null> {
        const ormEntity = await this.repository.findById(command.id);
        if (!ormEntity) {
            return null;
        }
        return LessonProgressEntity.mapToDomain(ormEntity);
    }

    async getProgressByUserAndLesson(
        userId: string,
        lessonId: string,
    ): Promise<LessonProgressEntity | null> {
        const ormEntity = await this.repository.findByUserAndLesson(userId, lessonId);
        if (!ormEntity) {
            return null;
        }
        return LessonProgressEntity.mapToDomain(ormEntity);
    }

    async getUserStatistics(userId: string): Promise<LessonProgressEntity[]> {
        const ormEntities = await this.repository.findAllByUser(userId);
        return ormEntities.map((ormEntity) => LessonProgressEntity.mapToDomain(ormEntity));
    }
}

import { LessonStatus } from "../../../modules/persistence/lesson-progress/lesson-progress.orm-entity";

export class CreateLessonProgressCommand {
    constructor(
        public readonly userId: string,
        public readonly lessonId: string,
        public readonly status: LessonStatus,
        public readonly currentPageNumber: number,
        public readonly totalPagesViewed: number,
        public readonly completionPercentage: number,
        public readonly timeSpentSeconds: number,
        public readonly lastViewedAt: Date,
        public readonly completedAt: Date | null,
        public readonly attempts: number,
        public readonly score: number | null,
        public readonly notes: string | null,
    ) {}
}

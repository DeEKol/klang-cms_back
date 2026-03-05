import { ApiProperty } from "@nestjs/swagger";
import { LessonProgressEntity } from "../../../domains/entities/lesson-progress.entity";
import { LessonStatus } from "../../persistence/lesson-progress/lesson-progress.orm-entity";

export class LessonProgressResponse {
    @ApiProperty({
        description: "Lesson progress ID (UUID)",
        example: "770e8400-e29b-41d4-a716-446655440000",
    })
    id: string;

    @ApiProperty({
        description: "User ID (UUID)",
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    userId: string;

    @ApiProperty({
        description: "Lesson ID (UUID)",
        example: "660e8400-e29b-41d4-a716-446655440000",
    })
    lessonId: string;

    @ApiProperty({
        description: "Lesson completion status",
        enum: LessonStatus,
        example: LessonStatus.IN_PROGRESS,
    })
    status: LessonStatus;

    @ApiProperty({
        description: "Current page number (1-based)",
        example: 2,
    })
    currentPageNumber: number;

    @ApiProperty({
        description: "Total unique pages viewed",
        example: 2,
    })
    totalPagesViewed: number;

    @ApiProperty({
        description: "Completion percentage (0-100)",
        example: 20,
    })
    completionPercentage: number;

    @ApiProperty({
        description: "Time spent on lesson in seconds",
        example: 240,
    })
    timeSpentSeconds: number;

    @ApiProperty({
        description: "Last time the lesson was viewed",
        example: "2025-01-15T11:00:00Z",
    })
    lastViewedAt: Date;

    @ApiProperty({
        description: "Date when lesson was completed",
        example: "2025-01-15T12:00:00Z",
        nullable: true,
    })
    completedAt: Date | null;

    @ApiProperty({
        description: "Number of attempts",
        example: 2,
    })
    attempts: number;

    @ApiProperty({
        description: "Score for the lesson",
        example: 90,
        nullable: true,
    })
    score: number | null;

    @ApiProperty({
        description: "User notes",
        example: "Reviewed and understood better",
        nullable: true,
    })
    notes: string | null;

    @ApiProperty({
        description: "Creation timestamp",
        example: "2025-01-15T10:00:00Z",
    })
    createdAt: Date;

    @ApiProperty({
        description: "Last update timestamp",
        example: "2025-01-15T11:00:00Z",
    })
    updatedAt: Date;

    static mapToResponse(entity: LessonProgressEntity): LessonProgressResponse {
        const response = new LessonProgressResponse();
        response.id = entity.id;
        response.userId = entity.userId;
        response.lessonId = entity.lessonId;
        response.status = entity.status;
        response.currentPageNumber = entity.currentPageNumber;
        response.totalPagesViewed = entity.totalPagesViewed;
        response.completionPercentage = entity.completionPercentage;
        response.timeSpentSeconds = entity.timeSpentSeconds;
        response.lastViewedAt = entity.lastViewedAt;
        response.completedAt = entity.completedAt;
        response.attempts = entity.attempts;
        response.score = entity.score;
        response.notes = entity.notes;
        response.createdAt = entity.createdAt;
        response.updatedAt = entity.updatedAt;
        return response;
    }
}

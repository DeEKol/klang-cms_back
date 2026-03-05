import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsNumber, IsDate, IsOptional, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { LessonStatus } from "../../persistence/lesson-progress/lesson-progress.orm-entity";

export class LessonProgressRequest {
    @ApiProperty({
        description: "User ID (UUID)",
        example: "550e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    userId: string;

    @ApiProperty({
        description: "Lesson ID (UUID)",
        example: "660e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    lessonId: string;

    @ApiProperty({
        description: "Lesson completion status",
        enum: LessonStatus,
        example: LessonStatus.IN_PROGRESS,
    })
    @IsEnum(LessonStatus)
    status: LessonStatus;

    @ApiProperty({
        description: "Current page number (1-based)",
        example: 1,
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    currentPageNumber: number;

    @ApiProperty({
        description: "Total unique pages viewed",
        example: 1,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    totalPagesViewed: number;

    @ApiProperty({
        description: "Completion percentage (0-100)",
        example: 10,
        minimum: 0,
        maximum: 100,
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    completionPercentage: number;

    @ApiProperty({
        description: "Time spent on lesson in seconds",
        example: 120,
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    timeSpentSeconds: number;

    @ApiProperty({
        description: "Last time the lesson was viewed",
        example: "2025-01-15T10:30:00Z",
    })
    @IsDate()
    @Type(() => Date)
    lastViewedAt: Date;

    @ApiProperty({
        description: "Date when lesson was completed (optional)",
        example: "2025-01-15T12:00:00Z",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    completedAt?: Date | null;

    @ApiProperty({
        description: "Number of attempts",
        example: 1,
        minimum: 1,
    })
    @IsNumber()
    @Min(1)
    attempts: number;

    @ApiProperty({
        description: "Score for the lesson (optional)",
        example: 85,
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    score?: number | null;

    @ApiProperty({
        description: "User notes (optional)",
        example: "Difficult grammar, need to review",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    notes?: string | null;
}

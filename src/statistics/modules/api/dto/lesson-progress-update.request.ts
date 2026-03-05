import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEnum, IsNumber, IsDate, IsOptional, Min, Max } from "class-validator";
import { Type } from "class-transformer";
import { LessonStatus } from "../../persistence/lesson-progress/lesson-progress.orm-entity";

export class LessonProgressUpdateRequest {
    @ApiProperty({
        description: "Lesson progress ID (UUID)",
        example: "770e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: "Lesson completion status",
        enum: LessonStatus,
        example: LessonStatus.IN_PROGRESS,
        required: false,
    })
    @IsOptional()
    @IsEnum(LessonStatus)
    status?: LessonStatus;

    @ApiProperty({
        description: "Current page number (1-based)",
        example: 2,
        minimum: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    currentPageNumber?: number;

    @ApiProperty({
        description: "Total unique pages viewed",
        example: 2,
        minimum: 0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    totalPagesViewed?: number;

    @ApiProperty({
        description: "Completion percentage (0-100)",
        example: 20,
        minimum: 0,
        maximum: 100,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    completionPercentage?: number;

    @ApiProperty({
        description: "Time spent on lesson in seconds",
        example: 240,
        minimum: 0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    timeSpentSeconds?: number;

    @ApiProperty({
        description: "Last time the lesson was viewed",
        example: "2025-01-15T11:00:00Z",
        required: false,
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    lastViewedAt?: Date;

    @ApiProperty({
        description: "Date when lesson was completed",
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
        example: 2,
        minimum: 1,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    attempts?: number;

    @ApiProperty({
        description: "Score for the lesson",
        example: 90,
        minimum: 0,
        maximum: 100,
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    score?: number | null;

    @ApiProperty({
        description: "User notes",
        example: "Reviewed and understood better",
        required: false,
        nullable: true,
    })
    @IsOptional()
    @IsString()
    notes?: string | null;
}

import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
    ILessonProgressUseCases,
    SLessonProgressUseCases,
} from "../../domains/ports/in/i-lesson-progress.use-cases";
import { LessonProgressRequest } from "./dto/lesson-progress.request";
import { LessonProgressUpdateRequest } from "./dto/lesson-progress-update.request";
import { LessonProgressResponse } from "./dto/lesson-progress.response";
import { CreateLessonProgressCommand } from "../../domains/ports/in/create-lesson-progress.command";
import { UpdateLessonProgressCommand } from "../../domains/ports/in/update-lesson-progress.command";
import { DeleteLessonProgressCommand } from "../../domains/ports/in/delete-lesson-progress.command";
import { GetLessonProgressCommand } from "../../domains/ports/in/get-lesson-progress.command";

@ApiTags("LessonProgress")
@Controller("statistics/lesson-progress")
export class LessonProgressController {
    constructor(
        @Inject(SLessonProgressUseCases)
        private readonly useCases: ILessonProgressUseCases,
    ) {}

    @Post("create")
    @ApiOperation({ summary: "Create new lesson progress" })
    @ApiResponse({
        status: 200,
        description: "Lesson progress created successfully",
        type: LessonProgressResponse,
    })
    async create(@Body() request: LessonProgressRequest): Promise<LessonProgressResponse> {
        const command = new CreateLessonProgressCommand(
            request.userId,
            request.lessonId,
            request.status,
            request.currentPageNumber,
            request.totalPagesViewed,
            request.completionPercentage,
            request.timeSpentSeconds,
            request.lastViewedAt,
            request.completedAt ?? null,
            request.attempts,
            request.score ?? null,
            request.notes ?? null,
        );

        const entity = await this.useCases.create(command);
        return LessonProgressResponse.mapToResponse(entity);
    }

    @Get("get/:id")
    @ApiOperation({ summary: "Get lesson progress by ID" })
    @ApiResponse({
        status: 200,
        description: "Lesson progress retrieved successfully",
        type: LessonProgressResponse,
    })
    @ApiResponse({
        status: 404,
        description: "Lesson progress not found",
    })
    async get(@Param("id") id: string): Promise<LessonProgressResponse | null> {
        const command = new GetLessonProgressCommand(id);
        const entity = await this.useCases.get(command);
        if (!entity) {
            return null;
        }
        return LessonProgressResponse.mapToResponse(entity);
    }

    @Post("update")
    @ApiOperation({ summary: "Update lesson progress" })
    @ApiResponse({
        status: 200,
        description: "Lesson progress updated successfully",
        type: Boolean,
    })
    async update(@Body() request: LessonProgressUpdateRequest): Promise<boolean> {
        const command = new UpdateLessonProgressCommand(
            request.id,
            request.status,
            request.currentPageNumber,
            request.totalPagesViewed,
            request.completionPercentage,
            request.timeSpentSeconds,
            request.lastViewedAt,
            request.completedAt,
            request.attempts,
            request.score,
            request.notes,
        );

        return this.useCases.update(command);
    }

    @Delete("delete/:id")
    @ApiOperation({ summary: "Delete lesson progress" })
    @ApiResponse({
        status: 200,
        description: "Lesson progress deleted successfully",
        type: Boolean,
    })
    async delete(@Param("id") id: string): Promise<boolean> {
        const command = new DeleteLessonProgressCommand(id);
        return this.useCases.delete(command);
    }

    @Get("user/:userId")
    @ApiOperation({ summary: "Get all statistics for a user" })
    @ApiResponse({
        status: 200,
        description: "User statistics retrieved successfully",
        type: [LessonProgressResponse],
    })
    async getUserStatistics(@Param("userId") userId: string): Promise<LessonProgressResponse[]> {
        const entities = await this.useCases.getUserStatistics(userId);
        return entities.map((entity) => LessonProgressResponse.mapToResponse(entity));
    }

    @Get("user/:userId/lesson/:lessonId")
    @ApiOperation({ summary: "Get progress for specific user and lesson" })
    @ApiResponse({
        status: 200,
        description: "Lesson progress retrieved successfully",
        type: LessonProgressResponse,
    })
    @ApiResponse({
        status: 404,
        description: "Lesson progress not found",
    })
    async getProgressByUserAndLesson(
        @Param("userId") userId: string,
        @Param("lessonId") lessonId: string,
    ): Promise<LessonProgressResponse | null> {
        const entity = await this.useCases.getProgressByUserAndLesson(userId, lessonId);
        if (!entity) {
            return null;
        }
        return LessonProgressResponse.mapToResponse(entity);
    }
}

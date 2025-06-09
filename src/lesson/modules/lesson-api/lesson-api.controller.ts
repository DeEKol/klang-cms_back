import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import {
    ILessonCrudUseCases,
    SLessonCrudUseCases,
} from "../../domains/ports/in/i-lesson-crud.use-cases";
import { SaveLessonCommand } from "../../domains/ports/in/save-lesson.command";
import { LessonResponse } from "./lesson.response";
import { LessonRequest } from "./lesson.request";
import { LessonUpdateRequest } from "./lesson-update.request";
import { UpdateLessonCommand } from "../../domains/ports/in/update-lesson.command";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Lesson")
@Controller("lesson")
export class LessonApiController {
    constructor(
        @Inject(SLessonCrudUseCases)
        private readonly _lessonCrudUseCases: ILessonCrudUseCases,
    ) {}

    @Post("create")
    @ApiOperation({ summary: "Create lesson" })
    @ApiResponse({ status: 200, description: "Create", type: Boolean })
    @ApiParam({ name: "text", type: "string" })
    create(@Body() lessonRequest: LessonRequest): Promise<boolean> {
        const command = SaveLessonCommand.of(lessonRequest);

        return this._lessonCrudUseCases.saveLesson(command);
    }

    @Get("find/:id")
    @ApiOperation({ summary: "Get one lesson" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Get one", type: LessonResponse })
    async findOne(@Param() { id }: { id: string }): Promise<LessonResponse | null> {
        // TODO: валидация, проверка начисла
        const lessonEntity = await this._lessonCrudUseCases.findLesson(id);

        const lessonResponse =
            lessonEntity !== null ? new LessonResponse(lessonEntity.id, lessonEntity.text) : null;

        return lessonResponse;
    }

    @Get("find")
    @ApiOperation({ summary: "Get all lessons" })
    @ApiResponse({ status: 200, description: "Get all", type: [LessonResponse] })
    async findAll(): Promise<LessonResponse[]> {
        const lessonEntityArray = await this._lessonCrudUseCases.findLessonArray();

        return lessonEntityArray.map((lessonEntity) => {
            return new LessonResponse(lessonEntity.id, lessonEntity.text);
        });
    }

    @Post("update")
    @ApiOperation({ summary: "Update lesson" })
    @ApiParam({ name: "text", type: "string" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Update", type: Boolean })
    update(@Body() lessonRequest: LessonUpdateRequest): Promise<boolean> {
        const command = UpdateLessonCommand.of(lessonRequest);

        return this._lessonCrudUseCases.updateLesson(command);
    }

    @Delete("delete/:id")
    @ApiOperation({ summary: "Delete lesson" })
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Delete", type: Boolean })
    delete(@Param() { id }: { id: string }): Promise<boolean> {
        return this._lessonCrudUseCases.deleteLesson(id);
    }
}

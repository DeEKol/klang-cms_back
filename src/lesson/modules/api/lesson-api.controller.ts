import { Body, Controller, Delete, Get, Inject, Param, Post } from "@nestjs/common";
import { ApiBody, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ILessonUseCases, SLessonCrudUseCases } from "../../domains/ports/in/i-lesson.use-cases";
import { GetLessonCommand } from "../../domains/ports/in/get-lesson.command";
import { DeleteLessonCommand } from "../../domains/ports/in/delete-lesson.command";
import { CreateLessonCommand } from "../../domains/ports/in/create-lesson.command";
import { UpdateLessonCommand } from "../../domains/ports/in/update-lesson.command";
import { LessonResponse } from "./dto/lesson.response";
import { LessonRequest } from "./dto/lesson.request";
import { LessonUpdateRequest } from "./dto/lesson-update.request";
import { LessonDeleteRequest } from "./dto/lesson-delete.request";
import { LessonFindRequest } from "./dto/lesson-find.request";

@ApiTags("Lesson")
@Controller("lesson")
export class LessonApiController {
    constructor(
        @Inject(SLessonCrudUseCases)
        private readonly _lessonCrudUseCases: ILessonUseCases,
    ) {}

    @Get("find/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Get one", type: LessonResponse })
    async findOne(@Param() { id }: LessonFindRequest): Promise<LessonResponse | null> {
        const command = new GetLessonCommand(id);
        const lessonEntity = await this._lessonCrudUseCases.getLesson(command);

        return LessonResponse.mapToResponse(lessonEntity);
    }

    @Delete("delete/:id")
    @ApiParam({ name: "id", type: "string" })
    @ApiResponse({ status: 200, description: "Delete one", type: Boolean })
    async deleteOne(@Param() { id }: LessonDeleteRequest): Promise<boolean> {
        const command = new DeleteLessonCommand(id);

        return this._lessonCrudUseCases.deleteLesson(command);
    }

    @Post("update")
    @ApiBody({ type: LessonUpdateRequest })
    @ApiResponse({ status: 200, description: "Update", type: Boolean })
    async update(@Body() { id, text }: LessonUpdateRequest): Promise<boolean> {
        const command = new UpdateLessonCommand(id, text);

        console.log(command);

        return this._lessonCrudUseCases.updateLesson(command);
    }

    @Post("create")
    @ApiBody({ type: LessonRequest })
    @ApiResponse({ status: 200, description: "Create", type: LessonResponse })
    async create(@Body() lessonRequest: LessonRequest): Promise<LessonResponse | null> {
        const command = new CreateLessonCommand(lessonRequest.text);

        const lessonEntity = await this._lessonCrudUseCases.createLesson(command);

        return LessonResponse.mapToResponse(lessonEntity);
    }
}

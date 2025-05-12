import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import {
    ILessonCrudUseCases,
    SLessonCrudUseCases,
} from "../../domains/ports/in/i-lesson-crud.use-cases";
import { SaveLessonCommand } from "../../domains/ports/in/save-lesson.command";
import { LessonResponse } from "./lesson.response";
import { LessonRequest } from "./lesson.request";

@Controller("lesson")
export class LessonApiController {
    constructor(
        @Inject(SLessonCrudUseCases)
        private readonly _lessonCrudUseCases: ILessonCrudUseCases,
    ) {}

    @Post("create")
    create(@Body() lessonRequest: LessonRequest): Promise<boolean> {
        const command = SaveLessonCommand.of(lessonRequest);

        return this._lessonCrudUseCases.saveLesson(command);
    }

    @Get("find")
    async findAll(): Promise<LessonResponse[]> {
        const lessonEntityArray = await this._lessonCrudUseCases.findLessonArray();

        return lessonEntityArray.map((lessonEntity) => {
            return new LessonResponse(lessonEntity.id, lessonEntity.text);
        });
    }
}

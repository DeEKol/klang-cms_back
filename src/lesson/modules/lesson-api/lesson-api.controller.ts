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

    @Get("find/:id")
    async findOne(@Param() { id }: { id: string }): Promise<LessonResponse | null> {
        // TODO: валидация, проверка начисла
        const lessonEntity = await this._lessonCrudUseCases.findLesson(+id);

        return lessonEntity !== null
            ? new LessonResponse(lessonEntity.id, lessonEntity.text)
            : null;
    }

    @Get("find")
    async findAll(): Promise<LessonResponse[]> {
        const lessonEntityArray = await this._lessonCrudUseCases.findLessonArray();

        return lessonEntityArray.map((lessonEntity) => {
            return new LessonResponse(lessonEntity.id, lessonEntity.text);
        });
    }

    @Post("update")
    update(@Body() lessonRequest: LessonUpdateRequest) {
        const command = UpdateLessonCommand.of(lessonRequest);

        return this._lessonCrudUseCases.updateLesson(command);
    }

    @Delete("delete/:id")
    delete(@Param() id: string) {
        return this._lessonCrudUseCases.deleteLesson(id);
    }
}

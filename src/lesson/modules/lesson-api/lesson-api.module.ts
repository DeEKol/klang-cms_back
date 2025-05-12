import { Module } from "@nestjs/common";
import { LessonApiController } from "./lesson-api.controller";

@Module({
    imports: [],
    controllers: [LessonApiController],
    providers: [],
    exports: [],
})
export class LessonApiModule {}

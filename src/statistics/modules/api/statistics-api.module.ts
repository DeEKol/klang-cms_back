import { Module } from "@nestjs/common";
import { LessonProgressController } from "./lesson-progress.controller";

@Module({
    imports: [],
    controllers: [LessonProgressController],
    providers: [],
    exports: [],
})
export class StatisticsApiModule {}

import { Module } from "@nestjs/common";

import { LessonCmsController } from "./lesson-cms.controller";

@Module({
    controllers: [LessonCmsController],
})
export class LessonCmsApiModule {}

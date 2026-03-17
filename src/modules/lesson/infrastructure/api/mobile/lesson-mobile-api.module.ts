import { Module } from "@nestjs/common";

import { LessonMobileController } from "./lesson-mobile.controller";

@Module({
    controllers: [LessonMobileController],
})
export class LessonMobileApiModule {}

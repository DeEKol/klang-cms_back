import { Module } from "@nestjs/common";

import { LessonCmsApiModule } from "./cms/lesson-cms-api.module";
import { LessonMobileApiModule } from "./mobile/lesson-mobile-api.module";

@Module({
    imports: [LessonCmsApiModule, LessonMobileApiModule],
})
export class LessonApiModule {}

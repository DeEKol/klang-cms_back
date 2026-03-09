import { Module } from "@nestjs/common";
import { LessonApiModule } from "./infrastructure/api/lesson-api.module";
import { LessonPersistenceModule } from "./infrastructure/persistence/lesson-persistence.module";
import { PageApiModule } from "./infrastructure/api/page-api.module";
import { SectionApiModule } from "./infrastructure/api/section-api.module";

@Module({
    imports: [LessonPersistenceModule, LessonApiModule, PageApiModule, SectionApiModule],
    controllers: [],
    providers: [],
})
export class LessonModule {}

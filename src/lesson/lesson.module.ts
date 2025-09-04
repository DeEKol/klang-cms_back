import { Module } from "@nestjs/common";
import { LessonApiModule } from "./modules/api/lesson-api.module";
import { LessonPersistenceModule } from "./modules/persistence/lesson-persistence.module";
import { PageApiModule } from "./modules/api/page-api.module";
import { SectionApiModule } from "./modules/api/section-api.module";

@Module({
    imports: [LessonPersistenceModule, LessonApiModule, PageApiModule, SectionApiModule],
    controllers: [],
    providers: [],
})
export class LessonModule {}

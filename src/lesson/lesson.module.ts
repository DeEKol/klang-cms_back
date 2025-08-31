import { Module } from "@nestjs/common";
import { LessonApiModule } from "./modules/api/lesson-api.module";
import { LessonPersistenceModule } from "./modules/persistence/lesson-persistence.module";
import { PageApiModule } from "./modules/api/page-api.module";

@Module({
    imports: [LessonApiModule, LessonPersistenceModule, PageApiModule],
    controllers: [],
    providers: [],
})
export class LessonModule {}

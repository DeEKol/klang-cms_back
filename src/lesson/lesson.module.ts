import { Module } from "@nestjs/common";
import { LessonApiModule } from "./modules/lesson-api/lesson-api.module";
import { LessonPersistenceModule } from "./modules/lesson-persistence/lesson-persistence.module";

@Module({
    imports: [LessonApiModule, LessonPersistenceModule],
    controllers: [],
    providers: [],
})
export class LessonModule {}

import { Module } from "@nestjs/common";

import { LessonApiModule } from "./infrastructure/api/lesson-api.module";
import { LessonPersistenceModule } from "./infrastructure/persistence/lesson-persistence.module";

@Module({
    imports: [LessonPersistenceModule, LessonApiModule],
    controllers: [],
    providers: [],
})
export class LessonModule {}

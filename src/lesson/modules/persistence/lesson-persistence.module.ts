import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SLessonCrudUseCases } from "../../domains/ports/in/i-lesson.use-cases";
import { LessonCrudService } from "../../domains/services/lesson-crud.service";
import { LessonPersistenceAdapter } from "./lesson-persistence.adapter";
import { LessonOrmEntity } from "./lesson/lesson.orm-entity";
import { LessonPageOrmEntity } from "./lesson-page/lesson-page.orm-entity";
import { SectionOrmEntity } from "./section/section.orm-entity";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([LessonOrmEntity, LessonPageOrmEntity, SectionOrmEntity])],
    controllers: [],
    providers: [
        LessonPersistenceAdapter,
        {
            provide: SLessonCrudUseCases,
            useFactory: (lessonPersistenceAdapter) => {
                return new LessonCrudService(lessonPersistenceAdapter);
            },
            inject: [LessonPersistenceAdapter],
        },
    ],
    exports: [SLessonCrudUseCases],
})
export class LessonPersistenceModule {}

import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonOrmEntity } from "./lesson.orm-entity";
import { LessonPersistenceAdapter } from "./lesson-persistence.adapter";
import { SLessonCrudUseCases } from "../../domains/ports/in/i-lesson-crud.use-cases";
import { LessonCrudService } from "../../domains/services/lesson-crud.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([LessonOrmEntity])],
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

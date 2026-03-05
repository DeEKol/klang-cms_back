import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LessonProgressOrmEntity } from "./lesson-progress/lesson-progress.orm-entity";
import { UserOrmEntity } from "../../../auth/modules/persistence/user/user.orm-entity";
import { LessonOrmEntity } from "../../../lesson/modules/persistence/lesson/lesson.orm-entity";
import { LessonProgressRepositoryAdapter } from "./lesson-progress-repository.adapter";
import { LessonProgressCrudService } from "../../domains/services/lesson-progress-crud.service";
import { SLessonProgressUseCases } from "../../domains/ports/in/i-lesson-progress.use-cases";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            LessonProgressOrmEntity,
            UserOrmEntity,
            LessonOrmEntity,
        ]),
    ],
    controllers: [],
    providers: [
        LessonProgressRepositoryAdapter,
        {
            provide: SLessonProgressUseCases,
            useFactory: (adapter: LessonProgressRepositoryAdapter) => {
                return new LessonProgressCrudService(adapter);
            },
            inject: [LessonProgressRepositoryAdapter],
        },
    ],
    exports: [SLessonProgressUseCases],
})
export class StatisticsPersistenceModule {}

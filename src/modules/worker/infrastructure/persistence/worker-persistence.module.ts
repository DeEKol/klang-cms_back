import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SWorkerUseCases } from "../../domains/ports/in/i-worker.use-cases";
import { WorkerService } from "../../domains/services/worker.service";
import { BcryptPasswordAdapter } from "./password/bcrypt-password.adapter";
import { WorkerRepositoryAdapter } from "./worker-repository.adapter";
import { WorkerOrmEntity } from "./worker/worker.orm-entity";
import { JwtAdapter } from "../../../../infrastructure/jwt/jwt.adapter";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([WorkerOrmEntity])],
    controllers: [],
    providers: [
        BcryptPasswordAdapter,
        WorkerRepositoryAdapter,
        {
            provide: SWorkerUseCases,
            useFactory: (
                workerRepository: WorkerRepositoryAdapter,
                passwordAdapter: BcryptPasswordAdapter,
                jwtAdapter: JwtAdapter,
            ) => new WorkerService(workerRepository, passwordAdapter, jwtAdapter),
            inject: [WorkerRepositoryAdapter, BcryptPasswordAdapter, JwtAdapter],
        },
    ],
    exports: [SWorkerUseCases],
})
export class WorkerPersistenceModule {}

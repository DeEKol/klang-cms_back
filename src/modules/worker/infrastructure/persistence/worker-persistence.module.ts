import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";

import { SWorkerUseCases } from "../../domains/ports/in/i-worker.use-cases";
import { WorkerService } from "../../domains/services/worker.service";
import { BcryptPasswordAdapter } from "./password/bcrypt-password.adapter";
import { WorkerRepositoryAdapter } from "./worker-repository.adapter";
import { WorkerOrmEntity } from "./worker/worker.orm-entity";
import { JwtAdapter } from "@infrastructure/jwt/jwt.adapter";
import { WorkerJwtStrategy } from "./auth/worker-jwt.strategy";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([WorkerOrmEntity]), PassportModule],
    controllers: [],
    providers: [
        BcryptPasswordAdapter,
        WorkerRepositoryAdapter,
        WorkerJwtStrategy,
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

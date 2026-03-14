import { Module } from "@nestjs/common";

import { WorkerPersistenceModule } from "./infrastructure/persistence/worker-persistence.module";
import { WorkerApiModule } from "./infrastructure/api/worker-api.module";

@Module({
    imports: [WorkerPersistenceModule, WorkerApiModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class WorkerModule {}

import { Module } from "@nestjs/common";

import { WorkerApiController } from "./worker-api.controller";

@Module({
    imports: [],
    controllers: [WorkerApiController],
    providers: [],
    exports: [],
})
export class WorkerApiModule {}

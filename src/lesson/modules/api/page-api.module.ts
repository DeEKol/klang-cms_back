import { Module } from "@nestjs/common";
import { PageApiController } from "./page-api.controller";

@Module({
    imports: [],
    controllers: [PageApiController],
    providers: [],
    exports: [],
})
export class PageApiModule {}

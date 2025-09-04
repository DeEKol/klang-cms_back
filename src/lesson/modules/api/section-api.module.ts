import { Module } from "@nestjs/common";
import { SectionApiController } from "./section-api.controller";

@Module({
    imports: [],
    controllers: [SectionApiController],
    providers: [],
    exports: [],
})
export class SectionApiModule {}

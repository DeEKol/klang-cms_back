import { Module } from "@nestjs/common";
import { UserApiController } from "./user-api.controller";

@Module({
    imports: [],
    controllers: [UserApiController],
    providers: [],
    exports: [],
})
export class UserApiModule {}

import { Module } from "@nestjs/common";
import { AuthApiController } from "./auth-api.controller";

@Module({
    imports: [],
    controllers: [AuthApiController],
    providers: [],
    exports: [],
})
export class AuthApiModule {}

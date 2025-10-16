import { Module } from "@nestjs/common";
import { AuthApiModule } from "./api/auth-api.module";
import { UserPersistenceModule } from "./persistence/user-persistance.module";

@Module({
    imports: [UserPersistenceModule, AuthApiModule],
    controllers: [],
    exports: [],
})
export class AuthModule {}

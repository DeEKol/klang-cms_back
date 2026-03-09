import { Module } from "@nestjs/common";
import { UserApiModule } from "./infrastructure/api/user-api.module";
import { UserPersistenceModule } from "./infrastructure/persistence/user-persistence.module";

@Module({
    imports: [UserPersistenceModule, UserApiModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class UserModule {}

import { Module } from "@nestjs/common";
import { UserApiModule } from "./modules/api/user-api.module";
import { UserPersistenceModule } from "./modules/persistence/user-persistence.module";

@Module({
    imports: [UserPersistenceModule, UserApiModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class UserModule {}

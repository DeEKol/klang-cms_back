import { Module, Global } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

import { AuthService } from "../../domains/services/auth.service";
import { UserOrmEntity } from "../persistence/user/user.orm-entity";
import { UserRepository } from "../persistence/user-repository";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || "dev-secret", // use env
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN,
            } as JwtModuleOptions["signOptions"],
        }),
    ],
    controllers: [],
    providers: [UserRepository, AuthService],
    exports: [AuthService],
})
export class UserPersistenceModule {}

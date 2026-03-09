import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

import { SUserUseCases } from "../../domains/ports/in/i-user.use-cases";
import { STokenService } from "../../domains/ports/in/i-token.service";
import { UserService } from "../../domains/services/user.service";
import { TokenService } from "../../domains/services/token.service";
import { FirebaseAuthAdapter } from "./firebase/firebase-auth.adapter";
import { JwtAuthAdapter } from "./jwt/jwt-auth.adapter";
import { UserRepositoryAdapter } from "./user-repository.adapter";
import { UserOrmEntity } from "./user/user.orm-entity";

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([UserOrmEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || "dev-secret",
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN,
            } as JwtModuleOptions["signOptions"],
        }),
    ],
    controllers: [],
    providers: [
        FirebaseAuthAdapter,
        JwtAuthAdapter,
        UserRepositoryAdapter,
        {
            provide: STokenService,
            useFactory: (jwtAuthAdapter: JwtAuthAdapter) => new TokenService(jwtAuthAdapter),
            inject: [JwtAuthAdapter],
        },
        {
            provide: SUserUseCases,
            useFactory: (
                firebaseAuthAdapter: FirebaseAuthAdapter,
                userRepositoryAdapter: UserRepositoryAdapter,
                tokenService: TokenService,
            ) => new UserService(firebaseAuthAdapter, userRepositoryAdapter, tokenService),
            inject: [FirebaseAuthAdapter, UserRepositoryAdapter, STokenService],
        },
    ],
    exports: [SUserUseCases],
})
export class UserPersistenceModule {}

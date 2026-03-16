import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";

import { SUserUseCases } from "../../domains/ports/in/i-user.use-cases";
import { STokenService } from "../../domains/ports/in/i-token.service";
import { UserService } from "../../domains/services/user.service";
import { TokenService } from "../../domains/services/token.service";
import { FirebaseAuthAdapter } from "./firebase/firebase-auth.adapter";
import { UserRepositoryAdapter } from "./user-repository.adapter";
import { UserOrmEntity } from "./user/user.orm-entity";
import { JwtAdapter } from "../../../../infrastructure/jwt/jwt.adapter";
import { UserFirebaseStrategy } from "./auth/user-firebase.strategy";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([UserOrmEntity]), PassportModule],
    controllers: [],
    providers: [
        FirebaseAuthAdapter,
        UserRepositoryAdapter,
        UserFirebaseStrategy,
        {
            provide: STokenService,
            useFactory: (jwtAdapter: JwtAdapter) => new TokenService(jwtAdapter),
            inject: [JwtAdapter],
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

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { UserEntity } from "../entities/user..orm-entity";
import { AuthApiController } from "./api/auth-api.controller";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../persistence/auth.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: process.env.JWT_SECRET || "dev-secret", // use env
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN,
            } as JwtModuleOptions["signOptions"],
        }),
    ],
    controllers: [AuthApiController],
    providers: [AuthService, AuthRepository],
    exports: [AuthService],
})
export class AuthModule {}

import { Global, Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

import { JwtAdapter } from "./jwt.adapter";

@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || "dev-secret",
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES_IN,
            } as JwtModuleOptions["signOptions"],
        }),
    ],
    providers: [JwtAdapter],
    exports: [JwtAdapter],
})
export class JwtSharedModule {}

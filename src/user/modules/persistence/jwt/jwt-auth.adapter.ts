import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { IJwtPayload, IJwtPort } from "../../../domains/ports/out/i-jwt.port";

@Injectable()
export class JwtAuthAdapter implements IJwtPort {
    constructor(private readonly jwtService: JwtService) {}

    sign(payload: IJwtPayload): Promise<string> {
        return this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        } as JwtSignOptions);
    }
}

import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

@Injectable()
export class JwtAdapter {
    constructor(private readonly jwtService: JwtService) {}

    sign(payload: object): Promise<string> {
        return this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        } as JwtSignOptions);
    }
}

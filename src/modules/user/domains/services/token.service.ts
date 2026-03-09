import { randomBytes } from "crypto";

import { IJwtPort } from "../ports/out/i-jwt.port";
import { ITokenService, ITokenPayload } from "../ports/in/i-token.service";
import { IUserTokens } from "../ports/in/i-user.use-cases";

export class TokenService implements ITokenService {
    constructor(private readonly jwtAuth: IJwtPort) {}

    async issue(payload: ITokenPayload): Promise<IUserTokens> {
        const accessToken = await this.jwtAuth.sign({
            sub: payload.id,
            uid: payload.uid,
            email: payload.email,
        });

        // TODO: persist refreshToken (DB table or redis) with expiry & user association
        const refreshToken = randomBytes(40).toString("hex");

        return { accessToken, refreshToken, expiresIn: process.env.JWT_EXPIRES_IN || "15m" };
    }
}

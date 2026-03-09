import { ApiProperty } from "@nestjs/swagger";

import { IUserTokens } from "../../../domains/ports/in/i-user.use-cases";

export class AuthResponse {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken: string;

    @ApiProperty({ example: "a3f8d2e1b0c4..." })
    refreshToken: string;

    @ApiProperty({ example: "15m" })
    expiresIn: string;

    static mapToResponse(tokens: IUserTokens): AuthResponse {
        const response = new AuthResponse();
        response.accessToken = tokens.accessToken;
        response.refreshToken = tokens.refreshToken;
        response.expiresIn = tokens.expiresIn;
        return response;
    }
}

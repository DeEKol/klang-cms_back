import { ApiProperty } from "@nestjs/swagger";

import { IWorkerTokens } from "../../../domains/ports/in/i-worker.use-cases";

export class WorkerAuthResponse {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken: string;

    @ApiProperty({ example: "a3f8d2e1b0c4..." })
    refreshToken: string;

    @ApiProperty({ example: "15m" })
    expiresIn: string;

    static mapToResponse(tokens: IWorkerTokens): WorkerAuthResponse {
        const response = new WorkerAuthResponse();
        response.accessToken = tokens.accessToken;
        response.refreshToken = tokens.refreshToken;
        response.expiresIn = tokens.expiresIn;
        return response;
    }
}

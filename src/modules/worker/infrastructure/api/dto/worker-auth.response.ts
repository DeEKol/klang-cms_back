import { ApiProperty } from "@nestjs/swagger";

import { IWorkerAccessToken, IWorkerTokens } from "../../../domains/ports/in/i-worker.use-cases";

export class WorkerAuthResponse {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
    accessToken: string;

    @ApiProperty({ example: "15m" })
    expiresIn: string;

    static mapToResponse(tokens: IWorkerTokens | IWorkerAccessToken): WorkerAuthResponse {
        const response = new WorkerAuthResponse();
        response.accessToken = tokens.accessToken;
        response.expiresIn = tokens.expiresIn;
        return response;
    }
}

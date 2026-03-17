import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Inject,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";

import { IWorkerUseCases, SWorkerUseCases } from "../../domains/ports/in/i-worker.use-cases";
import { SignInCommand } from "../../domains/ports/in/sign-in.command";
import { CreateWorkerCommand } from "../../domains/ports/in/create-worker.command";
import { RefreshTokenCommand } from "../../domains/ports/in/refresh-token.command";
import { WorkerRole } from "../../domains/entities/worker.entity";
import { SignInRequest } from "./dto/sign-in.request";
import { CreateWorkerRequest } from "./dto/create-worker.request";
import { WorkerAuthResponse } from "./dto/worker-auth.response";
import { WorkerResponse } from "./dto/worker.response";
import { WorkerAuthGuard } from "@infrastructure/auth/guards/worker-auth.guard";
import { WorkerRolesGuard } from "@infrastructure/auth/guards/worker-roles.guard";
import { Roles } from "@infrastructure/auth/decorators/roles.decorator";
import { CurrentWorker } from "@infrastructure/auth/decorators/current-worker.decorator";
import { IWorkerJwtPayload } from "../../infrastructure/persistence/auth/worker-jwt.strategy";

const REFRESH_TOKEN_COOKIE = "refresh_token";

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/cms/workers/auth/refresh",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d in ms
};

@ApiTags("CMS / Workers")
@Controller("cms/workers")
export class WorkerApiController {
    constructor(@Inject(SWorkerUseCases) private readonly workerUseCases: IWorkerUseCases) {}

    @Post("auth/sign-in")
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SignInRequest })
    @ApiResponse({
        status: 200,
        description: "Returns access token in body, sets refresh token in httpOnly cookie",
        type: WorkerAuthResponse,
    })
    async signIn(
        @Body() dto: SignInRequest,
        @Res({ passthrough: true }) res: Response,
    ): Promise<WorkerAuthResponse> {
        const tokens = await this.workerUseCases.signIn(new SignInCommand(dto.email, dto.password));

        res.cookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

        return WorkerAuthResponse.mapToResponse(tokens);
    }

    @Post("auth/refresh")
    @HttpCode(HttpStatus.OK)
    @ApiCookieAuth(REFRESH_TOKEN_COOKIE)
    @ApiResponse({
        status: 200,
        description: "Issues a new access token using the httpOnly refresh token cookie",
        type: WorkerAuthResponse,
    })
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<WorkerAuthResponse> {
        const refreshToken: string | undefined = (req.cookies as Record<string, string>)[
            REFRESH_TOKEN_COOKIE
        ];

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token not found");
        }

        const tokens = await this.workerUseCases.refresh(new RefreshTokenCommand(refreshToken));

        return WorkerAuthResponse.mapToResponse(tokens);
    }

    @Post()
    @UseGuards(WorkerAuthGuard, WorkerRolesGuard)
    @Roles(WorkerRole.ADMIN)
    @ApiBearerAuth()
    @ApiBody({ type: CreateWorkerRequest })
    @ApiResponse({
        status: 201,
        description: "Create a new worker (admin only)",
        type: WorkerResponse,
    })
    async createWorker(
        @Body() dto: CreateWorkerRequest,
        @CurrentWorker() _worker: IWorkerJwtPayload,
    ): Promise<WorkerResponse> {
        const worker = await this.workerUseCases.createWorker(
            new CreateWorkerCommand(dto.email, dto.password, dto.role, dto.displayName),
        );
        return WorkerResponse.mapToResponse(worker);
    }
}

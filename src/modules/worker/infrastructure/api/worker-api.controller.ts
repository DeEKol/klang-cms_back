import { Body, Controller, HttpCode, HttpStatus, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { IWorkerUseCases, SWorkerUseCases } from "../../domains/ports/in/i-worker.use-cases";
import { SignInCommand } from "../../domains/ports/in/sign-in.command";
import { CreateWorkerCommand } from "../../domains/ports/in/create-worker.command";
import { WorkerRole } from "../../domains/entities/worker.entity";
import { SignInRequest } from "./dto/sign-in.request";
import { CreateWorkerRequest } from "./dto/create-worker.request";
import { WorkerAuthResponse } from "./dto/worker-auth.response";
import { WorkerResponse } from "./dto/worker.response";
import { WorkerAuthGuard } from "../../../../infrastructure/auth/guards/worker-auth.guard";
import { WorkerRolesGuard } from "../../../../infrastructure/auth/guards/worker-roles.guard";
import { Roles } from "../../../../infrastructure/auth/decorators/roles.decorator";
import { CurrentWorker } from "../../../../infrastructure/auth/decorators/current-worker.decorator";
import { IWorkerJwtPayload } from "../../infrastructure/persistence/auth/worker-jwt.strategy";

@ApiTags("Workers")
@Controller("workers")
export class WorkerApiController {
    constructor(@Inject(SWorkerUseCases) private readonly workerUseCases: IWorkerUseCases) {}

    @Post("auth/sign-in")
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: SignInRequest })
    @ApiResponse({
        status: 200,
        description: "Sign in with email and password",
        type: WorkerAuthResponse,
    })
    async signIn(@Body() dto: SignInRequest): Promise<WorkerAuthResponse> {
        const tokens = await this.workerUseCases.signIn(new SignInCommand(dto.email, dto.password));
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

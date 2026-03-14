import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { IWorkerUseCases, SWorkerUseCases } from "../../domains/ports/in/i-worker.use-cases";
import { SignInCommand } from "../../domains/ports/in/sign-in.command";
import { CreateWorkerCommand } from "../../domains/ports/in/create-worker.command";
import { SignInRequest } from "./dto/sign-in.request";
import { CreateWorkerRequest } from "./dto/create-worker.request";
import { WorkerAuthResponse } from "./dto/worker-auth.response";
import { WorkerResponse } from "./dto/worker.response";

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
    @ApiBody({ type: CreateWorkerRequest })
    @ApiResponse({ status: 201, description: "Create a new worker", type: WorkerResponse })
    async createWorker(@Body() dto: CreateWorkerRequest): Promise<WorkerResponse> {
        const worker = await this.workerUseCases.createWorker(
            new CreateWorkerCommand(dto.email, dto.password, dto.role, dto.displayName),
        );
        return WorkerResponse.mapToResponse(worker);
    }
}

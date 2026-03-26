import { Result } from "@infrastructure/result/result";
import { ConflictError, UnauthorizedError } from "@infrastructure/errors/domain-errors";
import { WorkerEntity } from "../../entities/worker.entity";
import { SignInCommand } from "./sign-in.command";
import { CreateWorkerCommand } from "./create-worker.command";
import { RefreshTokenCommand } from "./refresh-token.command";

export const SWorkerUseCases = Symbol("WorkerUseCases");

export interface IWorkerTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface IWorkerAccessToken {
    accessToken: string;
    expiresIn: string;
}

export interface IWorkerUseCases {
    signIn(command: SignInCommand): Promise<Result<IWorkerTokens, UnauthorizedError>>;
    refresh(command: RefreshTokenCommand): Promise<Result<IWorkerAccessToken, UnauthorizedError>>;
    createWorker(command: CreateWorkerCommand): Promise<Result<WorkerEntity, ConflictError>>;
}

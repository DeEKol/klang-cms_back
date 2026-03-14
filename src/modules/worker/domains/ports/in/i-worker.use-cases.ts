import { WorkerEntity } from "../../entities/worker.entity";
import { SignInCommand } from "./sign-in.command";
import { CreateWorkerCommand } from "./create-worker.command";

export const SWorkerUseCases = Symbol("WorkerUseCases");

export interface IWorkerTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface IWorkerUseCases {
    signIn(command: SignInCommand): Promise<IWorkerTokens>;
    createWorker(command: CreateWorkerCommand): Promise<WorkerEntity>;
}

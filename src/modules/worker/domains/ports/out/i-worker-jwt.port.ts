import { WorkerRole } from "../../entities/worker.entity";

export interface IWorkerJwtPayload {
    sub: string;
    email: string;
    role: WorkerRole;
}

export interface IWorkerJwtPort {
    sign(payload: IWorkerJwtPayload): Promise<string>;
    signRefresh(payload: IWorkerJwtPayload): Promise<string>;
    verifyRefresh(token: string): Promise<Record<string, unknown>>;
}

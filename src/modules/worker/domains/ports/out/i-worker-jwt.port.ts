import { WorkerRole } from "../../entities/worker.entity";

export interface IWorkerJwtPayload {
    sub: string;
    email: string;
    role: WorkerRole;
}

export interface IWorkerJwtPort {
    sign(payload: IWorkerJwtPayload): Promise<string>;
}

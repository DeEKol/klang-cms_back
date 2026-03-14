import { WorkerEntity, WorkerRole } from "../../entities/worker.entity";

export type TCreateWorkerData = {
    email: string;
    passwordHash: string;
    role: WorkerRole;
    displayName?: string;
};

export interface IWorkerRepositoryPort {
    findByEmail(email: string): Promise<WorkerEntity | null>;
    findById(id: string): Promise<WorkerEntity | null>;
    create(data: TCreateWorkerData): Promise<WorkerEntity>;
}

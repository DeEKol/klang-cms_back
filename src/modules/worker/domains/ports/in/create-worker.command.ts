import { WorkerRole } from "../../entities/worker.entity";

export class CreateWorkerCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly role: WorkerRole,
        public readonly displayName?: string,
    ) {}
}

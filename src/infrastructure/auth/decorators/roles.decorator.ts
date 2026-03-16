import { SetMetadata } from "@nestjs/common";

import { WorkerRole } from "../../../modules/worker/domains/entities/worker.entity";

export const ROLES_KEY = "roles";

export const Roles = (...roles: WorkerRole[]) => SetMetadata(ROLES_KEY, roles);

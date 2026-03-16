import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { WorkerRole } from "../../../modules/worker/domains/entities/worker.entity";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { IWorkerJwtPayload } from "../../../modules/worker/infrastructure/persistence/auth/worker-jwt.strategy";

/**
 * Checks that the authenticated worker has one of the required roles.
 * Must be used after WorkerAuthGuard.
 *
 * @example
 * @UseGuards(WorkerAuthGuard, WorkerRolesGuard)
 * @Roles(WorkerRole.ADMIN)
 */
@Injectable()
export class WorkerRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<WorkerRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const worker: IWorkerJwtPayload = context.switchToHttp().getRequest().user;

        return requiredRoles.includes(worker?.role);
    }
}

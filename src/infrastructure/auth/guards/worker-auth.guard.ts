import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { WORKER_JWT_STRATEGY } from "../../../modules/worker/infrastructure/persistence/auth/worker-jwt.strategy";

/**
 * Protects endpoints for the CMS web application (Worker JWT).
 * Use on controllers or routes that belong to the CMS.
 */
@Injectable()
export class WorkerAuthGuard extends AuthGuard(WORKER_JWT_STRATEGY) {}

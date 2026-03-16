import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { IWorkerJwtPayload } from "../../../modules/worker/infrastructure/persistence/auth/worker-jwt.strategy";

export const CurrentWorker = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): IWorkerJwtPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

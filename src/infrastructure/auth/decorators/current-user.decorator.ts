import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { ICurrentUser } from "../../../modules/user/infrastructure/persistence/auth/user-firebase.strategy";

export const CurrentUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): ICurrentUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

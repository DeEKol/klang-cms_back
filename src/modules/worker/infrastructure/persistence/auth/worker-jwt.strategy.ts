import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { WorkerRole } from "../../../domains/entities/worker.entity";

export const WORKER_JWT_STRATEGY = "worker-jwt";

export interface IWorkerJwtPayload {
    sub: string;
    email: string;
    role: WorkerRole;
}

@Injectable()
export class WorkerJwtStrategy extends PassportStrategy(Strategy, WORKER_JWT_STRATEGY) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || "dev-secret",
        });
    }

    validate(payload: IWorkerJwtPayload): IWorkerJwtPayload {
        return { sub: payload.sub, email: payload.email, role: payload.role };
    }
}

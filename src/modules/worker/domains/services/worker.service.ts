import { Logger } from "@nestjs/common";

import { Result } from "@infrastructure/result/result";
import { ConflictError, UnauthorizedError } from "@infrastructure/errors/domain-errors";
import { WorkerEntity, WorkerRole } from "../entities/worker.entity";
import { IWorkerUseCases, IWorkerTokens, IWorkerAccessToken } from "../ports/in/i-worker.use-cases";
import { SignInCommand } from "../ports/in/sign-in.command";
import { CreateWorkerCommand } from "../ports/in/create-worker.command";
import { RefreshTokenCommand } from "../ports/in/refresh-token.command";
import { IWorkerRepositoryPort } from "../ports/out/i-worker-repository.port";
import { IPasswordPort } from "../ports/out/i-password.port";
import { IWorkerJwtPort, IWorkerJwtPayload } from "../ports/out/i-worker-jwt.port";

export class WorkerService implements IWorkerUseCases {
    private readonly logger = new Logger(WorkerService.name);

    constructor(
        private readonly workerRepository: IWorkerRepositoryPort,
        private readonly passwordPort: IPasswordPort,
        private readonly jwtPort: IWorkerJwtPort,
    ) {}

    async signIn(command: SignInCommand): Promise<Result<IWorkerTokens, UnauthorizedError>> {
        const worker = await this.workerRepository.findByEmail(command.email);

        if (!worker) {
            return Result.err(new UnauthorizedError("Invalid credentials"));
        }

        const isValid = await this.passwordPort.compare(command.password, worker.passwordHash);

        if (!isValid) {
            this.logger.warn(`Failed sign-in attempt for email: ${command.email}`);
            return Result.err(new UnauthorizedError("Invalid credentials"));
        }

        const jwtPayload: IWorkerJwtPayload = {
            sub: worker.id,
            email: worker.email,
            role: worker.role,
        };

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtPort.sign(jwtPayload),
            this.jwtPort.signRefresh(jwtPayload),
        ]);

        return Result.ok({
            accessToken,
            refreshToken,
            expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        });
    }

    async refresh(
        command: RefreshTokenCommand,
    ): Promise<Result<IWorkerAccessToken, UnauthorizedError>> {
        let raw: Record<string, unknown>;

        try {
            raw = await this.jwtPort.verifyRefresh(command.refreshToken);
        } catch {
            return Result.err(new UnauthorizedError("Invalid or expired refresh token"));
        }

        const accessToken = await this.jwtPort.sign({
            sub: raw["sub"] as string,
            email: raw["email"] as string,
            role: raw["role"] as WorkerRole,
        });

        return Result.ok({ accessToken, expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
    }

    async createWorker(command: CreateWorkerCommand): Promise<Result<WorkerEntity, ConflictError>> {
        const existing = await this.workerRepository.findByEmail(command.email);

        if (existing) {
            return Result.err(
                new ConflictError(`Worker with email ${command.email} already exists`),
            );
        }

        const passwordHash = await this.passwordPort.hash(command.password);

        const worker = await this.workerRepository.create({
            email: command.email,
            passwordHash,
            role: command.role,
            displayName: command.displayName,
        });

        return Result.ok(worker);
    }
}

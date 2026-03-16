import { ConflictException, Logger, UnauthorizedException } from "@nestjs/common";

import { WorkerEntity } from "../entities/worker.entity";
import { IWorkerUseCases, IWorkerTokens, IWorkerAccessToken } from "../ports/in/i-worker.use-cases";
import { SignInCommand } from "../ports/in/sign-in.command";
import { CreateWorkerCommand } from "../ports/in/create-worker.command";
import { RefreshTokenCommand } from "../ports/in/refresh-token.command";
import { IWorkerRepositoryPort } from "../ports/out/i-worker-repository.port";
import { IPasswordPort } from "../ports/out/i-password.port";
import { IWorkerJwtPort, IWorkerJwtPayload } from "../ports/out/i-worker-jwt.port";
import { WorkerRole } from "../entities/worker.entity";

export class WorkerService implements IWorkerUseCases {
    private readonly logger = new Logger(WorkerService.name);

    constructor(
        private readonly workerRepository: IWorkerRepositoryPort,
        private readonly passwordPort: IPasswordPort,
        private readonly jwtPort: IWorkerJwtPort,
    ) {}

    async signIn(command: SignInCommand): Promise<IWorkerTokens> {
        const worker = await this.workerRepository.findByEmail(command.email);

        if (!worker) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isValid = await this.passwordPort.compare(command.password, worker.passwordHash);

        if (!isValid) {
            this.logger.warn(`Failed sign-in attempt for email: ${command.email}`);
            throw new UnauthorizedException("Invalid credentials");
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

        return {
            accessToken,
            refreshToken,
            expiresIn: process.env.JWT_EXPIRES_IN || "15m",
        };
    }

    async refresh(command: RefreshTokenCommand): Promise<IWorkerAccessToken> {
        let raw: Record<string, unknown>;

        try {
            raw = await this.jwtPort.verifyRefresh(command.refreshToken);
        } catch {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        const accessToken = await this.jwtPort.sign({
            sub: raw["sub"] as string,
            email: raw["email"] as string,
            role: raw["role"] as WorkerRole,
        });

        return { accessToken, expiresIn: process.env.JWT_EXPIRES_IN || "15m" };
    }

    async createWorker(command: CreateWorkerCommand): Promise<WorkerEntity> {
        const existing = await this.workerRepository.findByEmail(command.email);

        if (existing) {
            throw new ConflictException(`Worker with email ${command.email} already exists`);
        }

        const passwordHash = await this.passwordPort.hash(command.password);

        return this.workerRepository.create({
            email: command.email,
            passwordHash,
            role: command.role,
            displayName: command.displayName,
        });
    }
}

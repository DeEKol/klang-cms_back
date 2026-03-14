import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { WorkerEntity } from "../../domains/entities/worker.entity";
import {
    IWorkerRepositoryPort,
    TCreateWorkerData,
} from "../../domains/ports/out/i-worker-repository.port";
import { WorkerOrmEntity } from "./worker/worker.orm-entity";

@Injectable()
export class WorkerRepositoryAdapter implements IWorkerRepositoryPort {
    constructor(
        @InjectRepository(WorkerOrmEntity)
        private readonly repo: Repository<WorkerOrmEntity>,
    ) {}

    async findByEmail(email: string): Promise<WorkerEntity | null> {
        const orm = await this.repo.findOne({ where: { email } });
        return WorkerEntity.mapToDomain(orm ?? null);
    }

    async findById(id: string): Promise<WorkerEntity | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return WorkerEntity.mapToDomain(orm ?? null);
    }

    async create(data: TCreateWorkerData): Promise<WorkerEntity> {
        const worker = this.repo.create(data);
        const saved = await this.repo.save(worker);
        return WorkerEntity.mapToDomain(saved) as WorkerEntity;
    }
}

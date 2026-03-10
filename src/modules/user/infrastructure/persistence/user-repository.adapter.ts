import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
    IUserRepositoryPort,
    TUserUid,
    TUserFirebasePayload,
} from "../../domains/ports/out/i-user-repository.port";
import { UserOrmEntity } from "./user/user.orm-entity";
import { UserEntity } from "../../domains/entities/user.entity";

@Injectable()
export class UserRepositoryAdapter implements IUserRepositoryPort {
    constructor(
        @InjectRepository(UserOrmEntity)
        private repo: Repository<UserOrmEntity>,
    ) {}

    async findByUid(uid: TUserUid): Promise<UserEntity | null> {
        const orm = await this.repo.findOne({ where: { uid } });
        return UserEntity.mapToDomain(orm);
    }

    async createOrUpdateFromFirebase(
        uid: TUserUid,
        payload: TUserFirebasePayload,
    ): Promise<UserEntity> {
        let user = await this.repo.findOne({ where: { uid } });

        if (!user) {
            user = this.repo.create({ uid, ...payload });
        } else {
            Object.assign(user, payload);
        }

        const saved = await this.repo.save(user);
        return UserEntity.mapToDomain(saved) as UserEntity;
    }
}

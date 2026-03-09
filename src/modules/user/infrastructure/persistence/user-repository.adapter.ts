import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
    IUserRepositoryPort,
    TUserUid,
    TUserFirebasePayload,
} from "../../domains/ports/out/i-user-repository.port";
import { UserOrmEntity } from "./user/user.orm-entity";

@Injectable()
export class UserRepositoryAdapter implements IUserRepositoryPort {
    constructor(
        @InjectRepository(UserOrmEntity)
        private repo: Repository<UserOrmEntity>,
    ) {}

    async findByUid(uid: TUserUid): Promise<UserOrmEntity | null> {
        return this.repo.findOne({ where: { uid } });
    }

    async createOrUpdateFromFirebase(
        uid: TUserUid,
        payload: TUserFirebasePayload,
    ): Promise<UserOrmEntity> {
        let user = await this.findByUid(uid);

        if (!user) {
            user = this.repo.create({ uid, ...payload });
        } else {
            Object.assign(user, payload);
        }

        return this.repo.save(user);
    }
}

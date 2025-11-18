import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserOrmEntity } from "./user/user.orm-entity";

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private repo: Repository<UserOrmEntity>,
    ) {}

    async findByUid(uid: string) {
        return this.repo.findOne({ where: { uid } });
    }

    async findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    async createOrUpdateFromFirebase(uid: string, payload: Partial<UserOrmEntity>) {
        let user = await this.findByUid(uid);

        if (!user) {
            user = this.repo.create({ uid, ...payload });
        } else {
            Object.assign(user, payload);
        }

        return this.repo.save(user);
    }
}

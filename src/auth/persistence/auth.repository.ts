import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user..orm-entity";

@Injectable()
export class AuthRepository {
    constructor(
        @InjectRepository(UserEntity)
        private repo: Repository<UserEntity>,
    ) {}

    async findByUid(uid: string) {
        return this.repo.findOne({ where: { uid } });
    }

    async findByEmail(email: string) {
        return this.repo.findOne({ where: { email } });
    }

    async createOrUpdateFromFirebase(uid: string, payload: Partial<UserEntity>) {
        let user = await this.findByUid(uid);
        if (!user) {
            user = this.repo.create({ uid, ...payload });
        } else {
            Object.assign(user, payload);
        }
        return this.repo.save(user);
    }
}

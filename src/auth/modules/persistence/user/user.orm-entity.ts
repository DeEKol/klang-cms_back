import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import type { TDecodedIdToken } from "../../../../firebase/admin";

export type TUserOrmEntity = UserOrmEntity;

@Entity({ name: "user" })
export class UserOrmEntity {
    // * Внутренний технический идентификатор (только для БД)
    @PrimaryGeneratedColumn("increment", { name: "id_pk" })
    idPk: number;

    // * Публичный бизнес-идентификатор (для API и клиентов)
    @Column({
        type: "uuid",
        unique: true,
        nullable: false,
    })
    id: string;

    @Column({ unique: true })
    uid: string; // firebase uid

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    displayName?: string;

    @Column({ nullable: true })
    photoURL?: string;

    @Column({ nullable: true })
    provider?: string;

    @Column({ type: "json", nullable: true })
    meta?: TDecodedIdToken;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

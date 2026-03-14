import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { WorkerRole } from "../../../domains/entities/worker.entity";

@Entity({ name: "worker" })
export class WorkerOrmEntity {
    @PrimaryGeneratedColumn("increment", { name: "id_pk" })
    idPk: number;

    @Column({ type: "uuid", unique: true, nullable: false })
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ name: "password_hash", nullable: false })
    passwordHash: string;

    @Column({
        type: "varchar",
        nullable: false,
        default: WorkerRole.EDITOR,
    })
    role: WorkerRole;

    @Column({ name: "display_name", nullable: true })
    displayName?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

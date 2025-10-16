import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
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
    meta?: Record<string, unknown>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

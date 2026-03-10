import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from "typeorm";
import { LessonOrmEntity } from "../lesson/lesson.orm-entity";
import { PageOrmEntity } from "../lesson-page/page.orm-entity";

@Entity({ name: "user_progress" })
@Unique(["userId", "lesson"])
export class UserProgressOrmEntity {
    @PrimaryGeneratedColumn("increment", { name: "id_pk" })
    idPk: number;

    @Column({ name: "user_id", nullable: false })
    userId: string;

    // Relation registered programmatically in src/infrastructure/cross-module-relations.ts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;

    @ManyToOne(() => LessonOrmEntity)
    @JoinColumn({ name: "lesson_id" })
    lesson: LessonOrmEntity;

    @ManyToOne(() => PageOrmEntity, { nullable: true })
    @JoinColumn({ name: "current_page_id" })
    currentPage: PageOrmEntity | null;

    @Column({ default: "in_progress" })
    status: string;

    @Column({ type: "simple-json", nullable: true })
    metadata: string | null;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

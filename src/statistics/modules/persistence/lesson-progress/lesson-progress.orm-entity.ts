import { v4 as uuidv4 } from "uuid";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
    Index,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserOrmEntity } from "../../../../auth/modules/persistence/user/user.orm-entity";
import { LessonOrmEntity } from "../../../../lesson/modules/persistence/lesson/lesson.orm-entity";

export enum LessonStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
}

@Entity({ name: "lesson_progress" })
@Index(["user", "lesson"], { unique: true })
export class LessonProgressOrmEntity {
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

    // * Связь с пользователем (многие прогрессы к одному пользователю)
    @ManyToOne(() => UserOrmEntity)
    @JoinColumn({ name: "user_id" })
    user: UserOrmEntity;

    // * Связь с уроком (многие прогрессы к одному уроку)
    @ManyToOne(() => LessonOrmEntity)
    @JoinColumn({ name: "lesson_id" })
    lesson: LessonOrmEntity;

    // * Статус прохождения урока
    @Column({
        type: "text",
        nullable: false,
        default: LessonStatus.NOT_STARTED,
    })
    status: LessonStatus;

    // * Текущая страница (1-based)
    @Column({
        type: "integer",
        nullable: false,
        default: 1,
    })
    currentPageNumber: number;

    // * Сколько уникальных страниц просмотрено
    @Column({
        type: "integer",
        nullable: false,
        default: 0,
    })
    totalPagesViewed: number;

    // * Процент завершения (0-100)
    @Column({
        type: "integer",
        nullable: false,
        default: 0,
    })
    completionPercentage: number;

    // * Общее время изучения урока в секундах
    @Column({
        type: "integer",
        nullable: false,
        default: 0,
    })
    timeSpentSeconds: number;

    // * Дата последнего просмотра
    @Column({
        type: "datetime",
        nullable: false,
    })
    lastViewedAt: Date;

    // * Дата завершения урока (null если не завершен)
    @Column({
        type: "datetime",
        nullable: true,
    })
    completedAt: Date | null;

    // * Количество попыток прохождения
    @Column({
        type: "integer",
        nullable: false,
        default: 1,
    })
    attempts: number;

    // * Балл за урок (опционально, для тестов)
    @Column({
        type: "integer",
        nullable: true,
    })
    score: number | null;

    // * Заметки пользователя
    @Column({
        type: "text",
        nullable: true,
    })
    notes: string | null;

    // * Дата создания записи
    @CreateDateColumn()
    createdAt: Date;

    // * Дата последнего обновления записи
    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

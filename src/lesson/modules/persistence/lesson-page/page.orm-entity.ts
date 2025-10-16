import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { LessonOrmEntity } from "../lesson/lesson.orm-entity";

@Entity({ name: "page" })
@Unique(["lesson", "order"])
export class PageOrmEntity {
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

    @Column({ name: "page_number" })
    order: number;

    @Column()
    text: string;

    @ManyToOne(() => LessonOrmEntity, (lessonOrmEntity) => lessonOrmEntity.pages)
    @JoinColumn({ name: "lesson_id" })
    lesson: LessonOrmEntity;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

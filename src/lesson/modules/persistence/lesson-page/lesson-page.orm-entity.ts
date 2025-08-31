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

@Entity()
@Unique(["lesson", "pageNumber"])
export class LessonPageOrmEntity {
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
    pageNumber: number;

    @Column()
    text: string;

    @ManyToOne(() => LessonOrmEntity, (lessonOrmEntity) => lessonOrmEntity.lessonPages)
    @JoinColumn({ name: "lesson_id" })
    lesson: LessonOrmEntity;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

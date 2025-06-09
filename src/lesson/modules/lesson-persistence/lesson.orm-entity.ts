import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { ILessonOrmEntity } from "./i-lesson.orm-entity";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class LessonOrmEntity implements ILessonOrmEntity {
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

    @Column()
    text: string;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

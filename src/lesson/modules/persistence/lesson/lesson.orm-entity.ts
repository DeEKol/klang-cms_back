import { v4 as uuidv4 } from "uuid";
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from "typeorm";
import { LessonPageOrmEntity } from "../lesson-page/lesson-page.orm-entity";

@Entity()
export class LessonOrmEntity {
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

    @OneToMany(() => LessonPageOrmEntity, (lessonOrmPage) => lessonOrmPage.lesson)
    lessonPages: LessonPageOrmEntity[];

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

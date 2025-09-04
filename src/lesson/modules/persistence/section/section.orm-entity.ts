import { v4 as uuidv4 } from "uuid";
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, OneToMany } from "typeorm";
import { LessonOrmEntity } from "../lesson/lesson.orm-entity";

@Entity()
export class SectionOrmEntity {
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

    @OneToMany(() => LessonOrmEntity, (sectionOrmPage) => sectionOrmPage.section)
    lessons: LessonOrmEntity[];

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

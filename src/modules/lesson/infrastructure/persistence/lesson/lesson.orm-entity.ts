import { v4 as uuidv4 } from "uuid";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    OneToMany,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { PageOrmEntity } from "../lesson-page/page.orm-entity";
import { SectionOrmEntity } from "../section/section.orm-entity";

@Entity({ name: "lesson" })
@Index(["section", "order"], { unique: true })
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

    @Column({
        nullable: false,
    })
    order: number;

    @OneToMany(() => PageOrmEntity, (lessonOrmPage) => lessonOrmPage.lesson)
    pages: PageOrmEntity[];

    @ManyToOne(() => SectionOrmEntity, (sectionOrmEntity) => sectionOrmEntity.lessons)
    @JoinColumn({ name: "section_id" })
    section: SectionOrmEntity;

    @BeforeInsert()
    generatePublicId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}

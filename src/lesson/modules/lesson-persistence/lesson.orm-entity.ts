import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ILessonOrmEntity } from "./i-lesson.orm-entity";

@Entity()
export class LessonOrmEntity implements ILessonOrmEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;
}

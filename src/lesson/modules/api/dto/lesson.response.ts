import { ApiProperty } from "@nestjs/swagger";
import { LessonEntity } from "../../../domains/entities/lesson.entity";

export class LessonResponse {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2" })
    id: string;

    @ApiProperty({ example: "Lesson one" })
    text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }

    static mapToResponse(lessonEntity: LessonEntity | null): LessonResponse | null {
        if (lessonEntity) return new LessonResponse(lessonEntity.id, lessonEntity.text);
        else return null;
    }
}

import { ApiProperty } from "@nestjs/swagger";
import { SectionEntity } from "../../../domains/entities/section.entity";
import { LessonResponse } from "./lesson.response";

export class SectionResponse {
    // TODO: проверка на uuid
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2", description: "uuid" })
    id: string;

    @ApiProperty({ example: "Section one", description: "Section text" })
    text: string;

    @ApiProperty({ type: [LessonResponse] })
    lessons: LessonResponse[];

    constructor(id: string, text: string, lessons: LessonResponse[]) {
        this.id = id;
        this.text = text;
        this.lessons = lessons;
    }

    static mapToResponse(sectionEntity: SectionEntity | null): SectionResponse | null {
        if (sectionEntity)
            return new SectionResponse(
                sectionEntity.id,
                sectionEntity.text,
                sectionEntity.lessons.reduce((acc, elem) => {
                    const lesson = LessonResponse.mapToResponse(elem);

                    if (lesson) acc.push(lesson);

                    return acc;
                }, [] as LessonResponse[]),
            );
        else return null;
    }
}

import { ApiProperty } from "@nestjs/swagger";
import { LessonEntity } from "../../../domains/entities/lesson.entity";
import { PageResponse } from "./page.response";

export class LessonResponse {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2" })
    id: string;

    @ApiProperty({ example: "Lesson one" })
    text: string;

    pages: { id: string; text: string }[];

    constructor(id: string, text: string, pages: PageResponse[]) {
        this.id = id;
        this.text = text;
        this.pages = pages;
    }

    static mapToResponse(lessonEntity: LessonEntity | null): LessonResponse | null {
        if (lessonEntity)
            return new LessonResponse(
                lessonEntity.id,
                lessonEntity.text,
                lessonEntity.pages.reduce((acc, elem) => {
                    const page = PageResponse.mapToResponse(elem);

                    if (page) acc.push(page);

                    return acc;
                }, [] as PageResponse[]),
            );
        else return null;
    }
}

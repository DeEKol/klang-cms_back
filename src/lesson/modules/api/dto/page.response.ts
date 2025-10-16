import { ApiProperty } from "@nestjs/swagger";
import { PageEntity } from "../../../domains/entities/page.entity";

export class PageResponse {
    // TODO: проверка на uuid
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2", description: "uuid" })
    id: string;

    @ApiProperty({ example: "Page one", description: "Page text" })
    text: string;

    @ApiProperty({ example: "1", description: "Page number" })
    pageNumber: number;

    constructor(id: string, text: string, pageNumber: number) {
        this.id = id;
        this.text = text;
        this.pageNumber = pageNumber;
    }

    static mapToResponse(lessonEntity: PageEntity | null): PageResponse | null {
        if (lessonEntity)
            return new PageResponse(lessonEntity.id, lessonEntity.text, lessonEntity.order);
        else return null;
    }
}

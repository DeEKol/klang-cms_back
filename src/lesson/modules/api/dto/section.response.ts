import { ApiProperty } from "@nestjs/swagger";
import { SectionEntity } from "../../../domains/entities/section.entity";

export class SectionResponse {
    // TODO: проверка на uuid
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2", description: "uuid" })
    id: string;

    @ApiProperty({ example: "Section one", description: "Section text" })
    text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }

    static mapToResponse(sectionEntity: SectionEntity | null): SectionResponse | null {
        if (sectionEntity) return new SectionResponse(sectionEntity.id, sectionEntity.text);
        else return null;
    }
}

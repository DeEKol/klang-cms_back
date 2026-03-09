import { ApiProperty } from "@nestjs/swagger";

// TODO: добавить валидацию
export class SectionCreateRequest {
    @ApiProperty({ example: "Section one", description: "Section text" })
    text: string;
}

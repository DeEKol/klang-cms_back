import { ApiProperty } from "@nestjs/swagger";

// TODO: добавить валидацию
export class PageCreateRequest {
    @ApiProperty({ example: "Page one", description: "Page text" })
    text: string;

    // TODO: проверка на uuid
    @ApiProperty({
        example: "4a2f7cce-548e-49d6-af56-c86f6f5a4e8d",
        description: "uuid",
    })
    lessonId: string;

    @ApiProperty({ example: "1", description: "Page number" })
    pageNumber: number;
}

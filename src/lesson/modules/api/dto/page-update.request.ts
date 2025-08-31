import { ApiProperty } from "@nestjs/swagger";

// TODO: добавить валидацию
export class PageUpdateRequest {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2", description: "uuid" })
    id: string;

    @ApiProperty({ example: "Page one", description: "Page text", required: false })
    text?: string;

    // TODO: проверка на uuid
    @ApiProperty({
        example: "4a2f7cce-548e-49d6-af56-c86f6f5a4e8d",
        description: "uuid",
        required: false,
    })
    lessonId?: string;

    @ApiProperty({ example: "1", description: "Page number", required: false })
    pageNumber?: number;
}

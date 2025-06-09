import { ApiProperty } from "@nestjs/swagger";

export class LessonResponse {
    @ApiProperty({ example: 1 })
    id: string;
    @ApiProperty({ example: "Item name" })
    text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
    }
}

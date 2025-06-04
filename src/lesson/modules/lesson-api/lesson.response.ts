import { ApiProperty } from "@nestjs/swagger";

export class LessonResponse {
    @ApiProperty({ example: 1 })
    id: number;
    @ApiProperty({ example: "Item name" })
    text: string;

    constructor(id: number, text: string) {
        this.id = id;
        this.text = text;
    }
}

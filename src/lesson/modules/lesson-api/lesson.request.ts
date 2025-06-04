import { ApiProperty } from "@nestjs/swagger";

export class LessonRequest {
    @ApiProperty({ example: "Lesson test text", description: "Lesson test text" })
    text: string;
}

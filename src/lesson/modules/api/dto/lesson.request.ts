import { ApiProperty } from "@nestjs/swagger";

export class LessonRequest {
    @ApiProperty({ example: "Lesson one", description: "Lesson text" })
    text: string;
}

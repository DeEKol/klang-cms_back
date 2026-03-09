import { ApiProperty } from "@nestjs/swagger";

// TODO: добавить валидацию
export class LessonUpdateRequest {
    @ApiProperty({ example: "48709c63-458e-4f90-8c39-577416a790f2", description: "uuid" })
    id: string;
    @ApiProperty({ example: "Lesson one", description: "Lesson text" })
    text?: string;
}

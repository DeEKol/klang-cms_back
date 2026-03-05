import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LessonProgressDeleteRequest {
    @ApiProperty({
        description: "Lesson progress ID (UUID)",
        example: "770e8400-e29b-41d4-a716-446655440000",
    })
    @IsString()
    id: string;
}

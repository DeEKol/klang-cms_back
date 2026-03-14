import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class SignInRequest {
    @ApiProperty({ example: "admin@example.com", description: "Worker email" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "secret123", description: "Worker password" })
    @IsString()
    @MinLength(6)
    password: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class FirebaseAuthRequest {
    @ApiProperty({
        example: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
        description: "Firebase ID token",
    })
    @IsString()
    idToken: string;
}

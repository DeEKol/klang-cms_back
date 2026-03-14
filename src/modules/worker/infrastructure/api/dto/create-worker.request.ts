import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

import { WorkerRole } from "../../../domains/entities/worker.entity";

export class CreateWorkerRequest {
    @ApiProperty({ example: "editor@example.com", description: "Worker email" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "secret123", description: "Worker password (min 6 chars)" })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: WorkerRole, example: WorkerRole.EDITOR, description: "Worker role" })
    @IsEnum(WorkerRole)
    role: WorkerRole;

    @ApiPropertyOptional({ example: "John Doe", description: "Display name" })
    @IsOptional()
    @IsString()
    displayName?: string;
}

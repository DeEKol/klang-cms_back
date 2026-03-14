import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { WorkerEntity, WorkerRole } from "../../../domains/entities/worker.entity";

export class WorkerResponse {
    @ApiProperty({ example: "550e8400-e29b-41d4-a716-446655440000" })
    id: string;

    @ApiProperty({ example: "editor@example.com" })
    email: string;

    @ApiProperty({ enum: WorkerRole, example: WorkerRole.EDITOR })
    role: WorkerRole;

    @ApiPropertyOptional({ example: "John Doe" })
    displayName?: string;

    @ApiProperty()
    createdAt: Date;

    static mapToResponse(worker: WorkerEntity): WorkerResponse {
        const response = new WorkerResponse();
        response.id = worker.id;
        response.email = worker.email;
        response.role = worker.role;
        response.displayName = worker.displayName;
        response.createdAt = worker.createdAt;
        return response;
    }
}

import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    HttpException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";

import {
    ConflictError,
    DomainError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
    ValidationError,
} from "./domain-errors";

export class DomainErrorMapper {
    static toHttpException(error: DomainError): HttpException {
        if (error instanceof NotFoundError) return new NotFoundException(error.message);
        if (error instanceof ConflictError) return new ConflictException(error.message);
        if (error instanceof UnauthorizedError) return new UnauthorizedException(error.message);
        if (error instanceof ForbiddenError) return new ForbiddenException(error.message);
        if (error instanceof ValidationError) return new BadRequestException(error.message);

        return new HttpException(error.message, 500);
    }
}

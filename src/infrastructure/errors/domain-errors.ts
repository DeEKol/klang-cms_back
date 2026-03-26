export abstract class DomainError {
    abstract readonly kind: string;
    constructor(readonly message: string) {}
}

export class NotFoundError extends DomainError {
    readonly kind = "NotFound" as const;
}

export class ConflictError extends DomainError {
    readonly kind = "Conflict" as const;
}

export class UnauthorizedError extends DomainError {
    readonly kind = "Unauthorized" as const;
}

export class ForbiddenError extends DomainError {
    readonly kind = "Forbidden" as const;
}

export class ValidationError extends DomainError {
    readonly kind = "Validation" as const;
}

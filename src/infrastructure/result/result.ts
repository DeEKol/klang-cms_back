export class Ok<T> {
    readonly ok = true as const;
    constructor(readonly value: T) {}
}

export class Err<E> {
    readonly ok = false as const;
    constructor(readonly error: E) {}
}

export type Result<T, E> = Ok<T> | Err<E>;

export const Result = {
    ok<T>(value: T): Ok<T> {
        return new Ok(value);
    },
    err<E>(error: E): Err<E> {
        return new Err(error);
    },
};

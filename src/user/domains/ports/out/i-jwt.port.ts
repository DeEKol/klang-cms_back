export interface IJwtPayload {
    sub: string;
    uid: string;
    email?: string;
}

export interface IJwtPort {
    sign(payload: IJwtPayload): Promise<string>;
}

import { IUserTokens } from "./i-user.use-cases";

export const STokenService = Symbol("TokenService");

export interface ITokenPayload {
    id: string;
    uid: string;
    email?: string;
}

export interface ITokenService {
    issue(payload: ITokenPayload): Promise<IUserTokens>;
}

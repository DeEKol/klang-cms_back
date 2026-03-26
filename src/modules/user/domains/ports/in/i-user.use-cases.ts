import { Result } from "@infrastructure/result/result";
import { UnauthorizedError } from "@infrastructure/errors/domain-errors";
import { SignInWithFirebaseCommand } from "./sign-in-with-firebase.command";

export const SUserUseCases = Symbol("UserUseCases");

export interface IUserTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface IUserUseCases {
    signInWithFirebase(command: SignInWithFirebaseCommand): Promise<Result<IUserTokens, UnauthorizedError>>;
}

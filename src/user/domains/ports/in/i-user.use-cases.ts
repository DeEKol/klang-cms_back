import { SignInWithFirebaseCommand } from "./sign-in-with-firebase.command";

export const SUserUseCases = Symbol("UserUseCases");

export interface IUserTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface IUserUseCases {
    signInWithFirebase(command: SignInWithFirebaseCommand): Promise<IUserTokens>;
}

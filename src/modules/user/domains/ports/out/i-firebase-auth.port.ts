import type { auth as authNamespace } from "firebase-admin";

export type TDecodedIdToken = authNamespace.DecodedIdToken;

export interface IFirebaseAuthPort {
    verifyIdToken(idToken: string): Promise<TDecodedIdToken>;
}

import type { TDecodedIdToken } from "./i-firebase-auth.port";
import { UserEntity } from "../../entities/user.entity";

export type TUserUid = string;

export type TUserFirebasePayload = {
    email?: string;
    displayName?: string;
    photoURL?: string;
    provider?: string;
    meta?: TDecodedIdToken;
};

export interface IUserRepositoryPort {
    findByUid(uid: TUserUid): Promise<UserEntity | null>;
    createOrUpdateFromFirebase(uid: TUserUid, payload: TUserFirebasePayload): Promise<UserEntity>;
}

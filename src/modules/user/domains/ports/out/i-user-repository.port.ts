import type { TDecodedIdToken } from "./i-firebase-auth.port";
import { UserOrmEntity } from "../../../infrastructure/persistence/user/user.orm-entity";

export type TUserUid = string;

export type TUserFirebasePayload = {
    email?: string;
    displayName?: string;
    photoURL?: string;
    provider?: string;
    meta?: TDecodedIdToken;
};

export interface IUserRepositoryPort {
    findByUid(uid: TUserUid): Promise<UserOrmEntity | null>;
    createOrUpdateFromFirebase(
        uid: TUserUid,
        payload: TUserFirebasePayload,
    ): Promise<UserOrmEntity>;
}

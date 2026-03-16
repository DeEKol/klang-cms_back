import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-custom";
import { Request } from "express";

import { FirebaseAuthAdapter } from "../firebase/firebase-auth.adapter";
import { TDecodedIdToken } from "../../../domains/ports/out/i-firebase-auth.port";

export const USER_FIREBASE_STRATEGY = "user-firebase";

export type ICurrentUser = TDecodedIdToken;

@Injectable()
export class UserFirebaseStrategy extends PassportStrategy(Strategy, USER_FIREBASE_STRATEGY) {
    constructor(private readonly firebaseAuth: FirebaseAuthAdapter) {
        super();
    }

    async validate(request: Request): Promise<ICurrentUser> {
        const authHeader = request.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing Firebase token");
        }

        const idToken = authHeader.slice(7);

        try {
            return await this.firebaseAuth.verifyIdToken(idToken);
        } catch {
            throw new UnauthorizedException("Invalid or expired Firebase token");
        }
    }
}

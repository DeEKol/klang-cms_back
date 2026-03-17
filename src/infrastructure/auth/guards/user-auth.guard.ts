import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { USER_FIREBASE_STRATEGY } from "@modules/user/infrastructure/persistence/auth/user-firebase.strategy";

/**
 * Protects endpoints for the mobile app.
 * Expects a Firebase ID token in the Authorization: Bearer header.
 */
@Injectable()
export class UserAuthGuard extends AuthGuard(USER_FIREBASE_STRATEGY) {}

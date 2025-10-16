import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { getFirebaseAdmin } from "../../firebase/admin";
import { AuthRepository } from "../persistence/auth.repository";
import { UserEntity } from "../entities/user..orm-entity";
import { randomBytes } from "crypto";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    private admin = getFirebaseAdmin();

    constructor(
        private readonly authRepo: AuthRepository,
        private readonly jwtService: JwtService,
    ) {}

    async handleFirebaseSignIn(idToken: string) {
        // 1) verify firebase idToken
        let decodedToken: any;
        console.log("idToken, idToken", idToken);

        try {
            decodedToken = await this.admin.auth().verifyIdToken(idToken);
        } catch (e) {
            this.logger.warn("Invalid Firebase idToken", e);
            throw new UnauthorizedException("Invalid Firebase token");
        }

        const { uid, email, name, picture, firebase } = decodedToken as any;

        // 2) create or update user in own DB
        const user = await this.authRepo.createOrUpdateFromFirebase(uid, {
            email: email ?? null,
            displayName: name ?? null,
            photoURL: picture ?? null,
            provider: (firebase && firebase.sign_in_provider) || null,
            meta: decodedToken,
        });

        // 3) issue backend tokens (access + refresh)
        const tokens = await this.issueTokens(user);

        return { user, ...tokens };
    }

    private async issueTokens(user: UserEntity) {
        const payload = { sub: user.id, uid: user.uid, email: user.email };
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        } as JwtSignOptions);

        // refresh token: generate random string and store on DB or in redis
        // for simplicity: generate and return (you should persist refresh token with user)
        const refreshToken = randomBytes(40).toString("hex");

        // TODO: persist refreshToken (DB table or redis) with expiry & user association
        // e.g. await this.refreshTokenRepo.save({ token: refreshToken, userId: user.id, expiresAt: ... })

        return { accessToken, refreshToken, expiresIn: process.env.JWT_EXPIRES_IN || "15m" };
    }

    // TODO: verifying refresh token later
    async refreshAccessToken(userId: string, refreshToken: string) {
        // validate refresh token against storage then sign a new accessToken
        // omitted for brevity
    }
}

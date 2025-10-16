import { Controller, Post, Body } from "@nestjs/common";
import { FirebaseAuthDto } from "./dto/firebase-auth.dto";
import { AuthService } from "../../services/auth.service";

@Controller("auth")
export class AuthApiController {
    constructor(private readonly authService: AuthService) {}

    @Post("firebase")
    async signInWithFirebase(@Body() dto: FirebaseAuthDto) {
        const authEntity = await this.authService.handleFirebaseSignIn(dto.idToken);
        // result: { user, accessToken, refreshToken, expiresIn }

        // console.log("authEntity", authEntity);

        // * AuthResponse.mapToResponse(authEntity)
        return {
            accessToken: authEntity.accessToken,
            // refreshToken: authEntity.refreshToken,
            // expiresIn: authEntity.expiresIn,
            // user: {
            //     id: authEntity.user.id,
            //     uid: authEntity.user.uid,
            //     email: authEntity.user.email,
            //     displayName: authEntity.user.displayName,
            // },
        };
    }
}

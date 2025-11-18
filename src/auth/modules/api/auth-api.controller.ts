import { Controller, Post, Body } from "@nestjs/common";
import { FirebaseAuthDto } from "./dto/firebase-auth.dto";
import { ApiBody, ApiParam, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";
import { AuthService } from "../../domains/services/auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthApiController {
    constructor(private readonly authService: AuthService) {}

    @Post("firebase")
    async signInWithFirebase(@Body() dto: FirebaseAuthDto) {
        const authData = await this.authService.handleFirebaseSignIn(dto.idToken);

        // * AuthResponse.mapToResponse(authEntity)
        return {
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            expiresIn: authData.expiresIn,
            // user: {
            //     id: authEntity.user.id,
            //     uid: authEntity.user.uid,
            //     email: authEntity.user.email,
            //     displayName: authEntity.user.displayName,
            // },
        };
    }
}

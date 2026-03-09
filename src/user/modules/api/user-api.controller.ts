import { Controller, Post, Body, Inject } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { IUserUseCases, SUserUseCases } from "../../domains/ports/in/i-user.use-cases";
import { SignInWithFirebaseCommand } from "../../domains/ports/in/sign-in-with-firebase.command";
import { FirebaseAuthRequest } from "./dto/firebase-auth.request";
import { AuthResponse } from "./dto/auth.response";

@ApiTags("Auth")
@Controller("auth")
export class UserApiController {
    constructor(@Inject(SUserUseCases) private readonly userUseCases: IUserUseCases) {}

    @Post("firebase")
    @ApiBody({ type: FirebaseAuthRequest })
    @ApiResponse({ status: 201, description: "Sign in with Firebase token", type: AuthResponse })
    async signInWithFirebase(@Body() dto: FirebaseAuthRequest): Promise<AuthResponse> {
        const tokens = await this.userUseCases.signInWithFirebase(
            new SignInWithFirebaseCommand(dto.idToken),
        );
        return AuthResponse.mapToResponse(tokens);
    }
}

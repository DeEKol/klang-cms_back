import { Controller, Post, Body, Inject } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { DomainErrorMapper } from "@infrastructure/errors/domain-error.mapper";
import { IUserUseCases, SUserUseCases } from "../../domains/ports/in/i-user.use-cases";
import { SignInWithFirebaseCommand } from "../../domains/ports/in/sign-in-with-firebase.command";
import { FirebaseAuthRequest } from "./dto/firebase-auth.request";
import { AuthResponse } from "./dto/auth.response";

@ApiTags("Mobile / Users")
@ApiBearerAuth()
@Controller("mob/users")
export class UserApiController {
    constructor(@Inject(SUserUseCases) private readonly userUseCases: IUserUseCases) {}

    @Post("auth")
    @ApiBody({ type: FirebaseAuthRequest })
    @ApiResponse({ status: 201, description: "Sign in with Firebase token", type: AuthResponse })
    async signInWithFirebase(@Body() dto: FirebaseAuthRequest): Promise<AuthResponse> {
        const result = await this.userUseCases.signInWithFirebase(
            new SignInWithFirebaseCommand(dto.idToken),
        );

        if (!result.ok) throw DomainErrorMapper.toHttpException(result.error);

        return AuthResponse.mapToResponse(result.value);
    }
}

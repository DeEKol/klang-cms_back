import { Logger } from "@nestjs/common";

import { Result } from "@infrastructure/result/result";
import { UnauthorizedError } from "@infrastructure/errors/domain-errors";
import { IFirebaseAuthPort } from "../ports/out/i-firebase-auth.port";
import { IUserRepositoryPort } from "../ports/out/i-user-repository.port";
import { ITokenService } from "../ports/in/i-token.service";
import { IUserUseCases, IUserTokens } from "../ports/in/i-user.use-cases";
import { SignInWithFirebaseCommand } from "../ports/in/sign-in-with-firebase.command";

export class UserService implements IUserUseCases {
    private readonly logger = new Logger(UserService.name);

    constructor(
        private readonly firebaseAuth: IFirebaseAuthPort,
        private readonly userRepository: IUserRepositoryPort,
        private readonly tokenService: ITokenService,
    ) {}

    async signInWithFirebase(
        command: SignInWithFirebaseCommand,
    ): Promise<Result<IUserTokens, UnauthorizedError>> {
        let decodedToken = null;

        try {
            decodedToken = await this.firebaseAuth.verifyIdToken(command.idToken);
        } catch (e) {
            this.logger.warn("Invalid Firebase idToken", e);
            return Result.err(new UnauthorizedError("Invalid Firebase token"));
        }

        const { uid, email, name, picture, firebase } = decodedToken;

        const user = await this.userRepository.createOrUpdateFromFirebase(uid, {
            email,
            displayName: name ?? "",
            photoURL: picture,
            provider: firebase && firebase.sign_in_provider,
            meta: decodedToken,
        });

        const tokens = await this.tokenService.issue({ id: user.id, uid: user.uid, email: user.email });
        return Result.ok(tokens);
    }
}

import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { IPasswordPort } from "../../../domains/ports/out/i-password.port";

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptPasswordAdapter implements IPasswordPort {
    hash(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}

import { Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { app as appNamespace, credential } from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

import {
    IFirebaseAuthPort,
    TDecodedIdToken,
} from "../../../domains/ports/out/i-firebase-auth.port";

let firebaseApp: appNamespace.App | undefined;

function getFirebaseApp(): appNamespace.App {
    if (firebaseApp) return firebaseApp;

    // * Загрузка сервиса из JSON (recommended for server)
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH;

    if (keyPath) {
        const path = join(process.cwd(), keyPath);
        const serviceAccount = JSON.parse(readFileSync(path, "utf8"));
        firebaseApp = admin.initializeApp({ credential: credential.cert(serviceAccount) });
    } else {
        // * Либо через GOOGLE_APPLICATION_CREDENTIALS или окружение
        firebaseApp = admin.initializeApp();
    }

    return firebaseApp;
}

@Injectable()
export class FirebaseAuthAdapter implements IFirebaseAuthPort {
    private readonly app = getFirebaseApp();

    async verifyIdToken(idToken: string): Promise<TDecodedIdToken> {
        return this.app.auth().verifyIdToken(idToken);
    }
}

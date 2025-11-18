import * as admin from "firebase-admin";
import { app as appNamespace, auth as authNamespace, credential } from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

let firebaseAdmin: appNamespace.App | undefined;

export type TDecodedIdToken = authNamespace.DecodedIdToken;

export function getFirebaseAdmin(): appNamespace.App {
    if (firebaseAdmin) return firebaseAdmin;

    // * Загрузка сервиса из JSON (recommended for server)
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH;

    if (keyPath) {
        const path = join(process.cwd(), keyPath);
        const serviceAccountString = readFileSync(path, "utf8");
        const serviceAccount = JSON.parse(serviceAccountString);

        firebaseAdmin = admin.initializeApp({
            credential: credential.cert(serviceAccount),
        });
    } else {
        // * Либо через GOOGLE_APPLICATION_CREDENTIALS или окружение
        firebaseAdmin = admin.initializeApp();
    }

    return firebaseAdmin;
}

import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

let app: admin.app.App | undefined;

export function getFirebaseAdmin(): admin.app.App {
    if (app) return app;

    // * Загрузка сервиса из JSON (recommended for server)
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH;
    if (keyPath) {
        const serviceAccount = JSON.parse(readFileSync(join(process.cwd(), keyPath), "utf8"));
        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        return app;
    }

    // * Либо через GOOGLE_APPLICATION_CREDENTIALS или окружение
    app = admin.initializeApp();
    return app;
}

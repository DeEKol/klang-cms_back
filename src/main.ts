import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

import { GlobalExceptionFilter } from "./infrastructure/filters/global-exception.filter";

import { WorkerApiModule } from "./modules/worker/infrastructure/api/worker-api.module";
import { LessonCmsApiModule } from "./modules/lesson/infrastructure/api/cms/lesson-cms-api.module";
import { LessonMobileApiModule } from "./modules/lesson/infrastructure/api/mobile/lesson-mobile-api.module";
import { UserApiModule } from "./modules/user/infrastructure/api/user-api.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.use(cookieParser());

    app.enableCors({
        origin: process.env.CORS_DOMEN,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization",
        credentials: true,
    });

    // * CMS Swagger — /api/cms
    const cmsConfig = new DocumentBuilder()
        .setTitle("CMS API")
        .setDescription("API для веб-приложения CMS (workers)")
        .setVersion("1.0")
        .addBearerAuth()
        .addCookieAuth("refresh_token")
        .build();

    const cmsDocument = SwaggerModule.createDocument(app, cmsConfig, {
        include: [WorkerApiModule, LessonCmsApiModule],
    });
    SwaggerModule.setup("api/cms", app, cmsDocument);

    // * Mobile Swagger — /api/mobile
    const mobileConfig = new DocumentBuilder()
        .setTitle("Mobile API")
        .setDescription("API для мобильного приложения (users, Firebase auth)")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const mobileDocument = SwaggerModule.createDocument(app, mobileConfig, {
        include: [UserApiModule, LessonMobileApiModule],
    });
    SwaggerModule.setup("api/mobile", app, mobileDocument);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();

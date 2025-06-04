import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // * Настройка Swagger
    const config = new DocumentBuilder()
        .setTitle("My API")
        .setDescription("API description")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    app.enableCors({
        origin: process.env.CORS_DOMEN,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        allowedHeaders: "Content-Type, Authorization",
        credentials: true,
    });

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();

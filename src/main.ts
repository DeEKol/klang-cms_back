import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: process.env.CORS_DOMEN, // Разрешаем запросы только с данного домена
        methods: "GET,POST", // Разрешенные HTTP-методы
        allowedHeaders: "Content-Type, Authorization", // Разрешенные заголовки
        credentials: true, // Разрешаем отправку cookies
    });

    await app.listen(process.env.PORT || 3000);
}
bootstrap();

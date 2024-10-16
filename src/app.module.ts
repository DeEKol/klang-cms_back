import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ["./.env"],
        }),
    ],
    controllers: [AppController],
    providers: [],
    exports: [],
})
export class AppModule {}

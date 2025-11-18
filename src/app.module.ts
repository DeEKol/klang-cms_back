import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import DataSource from "./data-source";
import { LessonModule } from "./lesson/lesson.module";
import { AuthModule } from "./auth/modules/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ["./.env"],
        }),
        TypeOrmModule.forRoot(DataSource.options),
        LessonModule,
        AuthModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}

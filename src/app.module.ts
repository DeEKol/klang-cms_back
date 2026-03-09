import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import DataSource from "./data-source";
import { LessonModule } from "./lesson/lesson.module";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ["./.env"],
        }),
        TypeOrmModule.forRoot(DataSource.options),
        LessonModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}

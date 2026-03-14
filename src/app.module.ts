import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import DataSource from "./data-source";
import { LessonModule } from "./modules/lesson/lesson.module";
import { UserModule } from "./modules/user/user.module";
import { WorkerModule } from "./modules/worker/worker.module";
import { JwtSharedModule } from "./infrastructure/jwt/jwt.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ["./.env"],
        }),
        TypeOrmModule.forRoot(DataSource.options),
        JwtSharedModule,
        LessonModule,
        UserModule,
        WorkerModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}

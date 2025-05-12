import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { LessonModule } from "./lesson/lesson.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ["./.env"],
        }),
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "database.sqlite",
            entities: [__dirname + "/**/*.orm-entity{.ts,.js}"],
            synchronize: true, // ! Только для разработки — не использовать в проде
        }),
        LessonModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule {}

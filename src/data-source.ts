import { DataSource } from "typeorm";
import { PageOrmEntity } from "./modules/lesson/infrastructure/persistence/lesson-page/page.orm-entity";
import { SectionOrmEntity } from "./modules/lesson/infrastructure/persistence/section/section.orm-entity";
import { LessonOrmEntity } from "./modules/lesson/infrastructure/persistence/lesson/lesson.orm-entity";
import { UserOrmEntity } from "./modules/user/infrastructure/persistence/user/user.orm-entity";
import { UserProgressOrmEntity } from "./modules/lesson/infrastructure/persistence/user-progress/user-progress.orm-entity";

export default new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    // entities: [__dirname + "/**/*.orm-entity{.ts,.js}"],
    entities: [
        PageOrmEntity,
        SectionOrmEntity,
        LessonOrmEntity,
        UserOrmEntity,
        UserProgressOrmEntity,
    ],
    synchronize: false,
    migrations: [__dirname + "/migrations/*.ts"],
});

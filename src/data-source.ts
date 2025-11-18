import { DataSource } from "typeorm";
import { PageOrmEntity } from "./lesson/modules/persistence/lesson-page/page.orm-entity";
import { SectionOrmEntity } from "./lesson/modules/persistence/section/section.orm-entity";
import { LessonOrmEntity } from "./lesson/modules/persistence/lesson/lesson.orm-entity";
import { UserOrmEntity } from "./auth/modules/persistence/user/user.orm-entity";

export default new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    // entities: [__dirname + "/**/*.orm-entity{.ts,.js}"],
    entities: [PageOrmEntity, SectionOrmEntity, LessonOrmEntity, UserOrmEntity],
    synchronize: false,
    migrations: [__dirname + "/migrations/*.ts"],
});

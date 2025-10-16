import { DataSource } from "typeorm";
import { PageOrmEntity } from "./lesson/modules/persistence/lesson-page/page.orm-entity";
import { SectionOrmEntity } from "./lesson/modules/persistence/section/section.orm-entity";
import { LessonOrmEntity } from "./lesson/modules/persistence/lesson/lesson.orm-entity";

export default new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    // entities: [__dirname + "/**/*.orm-entity{.ts,.js}"],
    entities: [PageOrmEntity, SectionOrmEntity, LessonOrmEntity],
    synchronize: false,
    migrations: [__dirname + "/migrations/*.ts"],
});

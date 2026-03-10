import { MigrationInterface, QueryRunner } from "typeorm";

export class UserProgressTable1773154815605 implements MigrationInterface {
    name = 'UserProgressTable1773154815605'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_progress" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('in_progress'), "metadata" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "lesson_id" integer, "current_page_id" integer, CONSTRAINT "UQ_de6c7692d227177d4979fa43d49" UNIQUE ("user_id", "lesson_id"))`);
        await queryRunner.query(`CREATE TABLE "temporary_user_progress" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('in_progress'), "metadata" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "lesson_id" integer, "current_page_id" integer, CONSTRAINT "UQ_de6c7692d227177d4979fa43d49" UNIQUE ("user_id", "lesson_id"), CONSTRAINT "FK_043658a2afb0ca5bd8375d49cb9" FOREIGN KEY ("lesson_id") REFERENCES "lesson" ("id_pk") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_318dcf241fb572e9885aff3d740" FOREIGN KEY ("current_page_id") REFERENCES "page" ("id_pk") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c41601eeb8415a9eb15c8a4e557" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user_progress"("id_pk", "user_id", "status", "metadata", "created_at", "updated_at", "lesson_id", "current_page_id") SELECT "id_pk", "user_id", "status", "metadata", "created_at", "updated_at", "lesson_id", "current_page_id" FROM "user_progress"`);
        await queryRunner.query(`DROP TABLE "user_progress"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_progress" RENAME TO "user_progress"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_progress" RENAME TO "temporary_user_progress"`);
        await queryRunner.query(`CREATE TABLE "user_progress" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('in_progress'), "metadata" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "lesson_id" integer, "current_page_id" integer, CONSTRAINT "UQ_de6c7692d227177d4979fa43d49" UNIQUE ("user_id", "lesson_id"))`);
        await queryRunner.query(`INSERT INTO "user_progress"("id_pk", "user_id", "status", "metadata", "created_at", "updated_at", "lesson_id", "current_page_id") SELECT "id_pk", "user_id", "status", "metadata", "created_at", "updated_at", "lesson_id", "current_page_id" FROM "temporary_user_progress"`);
        await queryRunner.query(`DROP TABLE "temporary_user_progress"`);
        await queryRunner.query(`DROP TABLE "user_progress"`);
    }

}

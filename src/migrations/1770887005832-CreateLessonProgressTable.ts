import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLessonProgressTable1770887005832 implements MigrationInterface {
    name = 'CreateLessonProgressTable1770887005832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lesson_progress" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "status" text NOT NULL DEFAULT ('not_started'), "currentPageNumber" integer NOT NULL DEFAULT (1), "totalPagesViewed" integer NOT NULL DEFAULT (0), "completionPercentage" integer NOT NULL DEFAULT (0), "timeSpentSeconds" integer NOT NULL DEFAULT (0), "lastViewedAt" datetime NOT NULL, "completedAt" datetime, "attempts" integer NOT NULL DEFAULT (1), "score" integer, "notes" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "user_id" integer, "lesson_id" integer, CONSTRAINT "UQ_e6223ebbc5f8f5fce40e0193de1" UNIQUE ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f34e3a227170e0ce674e0afb58" ON "lesson_progress" ("user_id", "lesson_id") `);
        await queryRunner.query(`DROP INDEX "IDX_f34e3a227170e0ce674e0afb58"`);
        await queryRunner.query(`CREATE TABLE "temporary_lesson_progress" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "status" text NOT NULL DEFAULT ('not_started'), "currentPageNumber" integer NOT NULL DEFAULT (1), "totalPagesViewed" integer NOT NULL DEFAULT (0), "completionPercentage" integer NOT NULL DEFAULT (0), "timeSpentSeconds" integer NOT NULL DEFAULT (0), "lastViewedAt" datetime NOT NULL, "completedAt" datetime, "attempts" integer NOT NULL DEFAULT (1), "score" integer, "notes" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "user_id" integer, "lesson_id" integer, CONSTRAINT "UQ_e6223ebbc5f8f5fce40e0193de1" UNIQUE ("id"), CONSTRAINT "FK_0d9292b3eb40707950eeeba9617" FOREIGN KEY ("user_id") REFERENCES "user" ("id_pk") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_980e74721039ebe210fee2eeca2" FOREIGN KEY ("lesson_id") REFERENCES "lesson" ("id_pk") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_lesson_progress"("id_pk", "id", "status", "currentPageNumber", "totalPagesViewed", "completionPercentage", "timeSpentSeconds", "lastViewedAt", "completedAt", "attempts", "score", "notes", "createdAt", "updatedAt", "user_id", "lesson_id") SELECT "id_pk", "id", "status", "currentPageNumber", "totalPagesViewed", "completionPercentage", "timeSpentSeconds", "lastViewedAt", "completedAt", "attempts", "score", "notes", "createdAt", "updatedAt", "user_id", "lesson_id" FROM "lesson_progress"`);
        await queryRunner.query(`DROP TABLE "lesson_progress"`);
        await queryRunner.query(`ALTER TABLE "temporary_lesson_progress" RENAME TO "lesson_progress"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f34e3a227170e0ce674e0afb58" ON "lesson_progress" ("user_id", "lesson_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_f34e3a227170e0ce674e0afb58"`);
        await queryRunner.query(`ALTER TABLE "lesson_progress" RENAME TO "temporary_lesson_progress"`);
        await queryRunner.query(`CREATE TABLE "lesson_progress" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "status" text NOT NULL DEFAULT ('not_started'), "currentPageNumber" integer NOT NULL DEFAULT (1), "totalPagesViewed" integer NOT NULL DEFAULT (0), "completionPercentage" integer NOT NULL DEFAULT (0), "timeSpentSeconds" integer NOT NULL DEFAULT (0), "lastViewedAt" datetime NOT NULL, "completedAt" datetime, "attempts" integer NOT NULL DEFAULT (1), "score" integer, "notes" text, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "user_id" integer, "lesson_id" integer, CONSTRAINT "UQ_e6223ebbc5f8f5fce40e0193de1" UNIQUE ("id"))`);
        await queryRunner.query(`INSERT INTO "lesson_progress"("id_pk", "id", "status", "currentPageNumber", "totalPagesViewed", "completionPercentage", "timeSpentSeconds", "lastViewedAt", "completedAt", "attempts", "score", "notes", "createdAt", "updatedAt", "user_id", "lesson_id") SELECT "id_pk", "id", "status", "currentPageNumber", "totalPagesViewed", "completionPercentage", "timeSpentSeconds", "lastViewedAt", "completedAt", "attempts", "score", "notes", "createdAt", "updatedAt", "user_id", "lesson_id" FROM "temporary_lesson_progress"`);
        await queryRunner.query(`DROP TABLE "temporary_lesson_progress"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f34e3a227170e0ce674e0afb58" ON "lesson_progress" ("user_id", "lesson_id") `);
        await queryRunner.query(`DROP INDEX "IDX_f34e3a227170e0ce674e0afb58"`);
        await queryRunner.query(`DROP TABLE "lesson_progress"`);
    }

}

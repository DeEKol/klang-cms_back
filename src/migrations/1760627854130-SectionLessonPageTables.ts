import { MigrationInterface, QueryRunner } from "typeorm";

export class SectionLessonPageTables1760627854130 implements MigrationInterface {
    name = 'SectionLessonPageTables1760627854130'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "section" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "text" varchar NOT NULL, "order" integer NOT NULL, CONSTRAINT "UQ_3c41d2d699384cc5e8eac54777d" UNIQUE ("id"), CONSTRAINT "UQ_cbe73f13df97c02a097f9ba77ee" UNIQUE ("order"))`);
        await queryRunner.query(`CREATE TABLE "lesson" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "text" varchar NOT NULL, "order" integer NOT NULL, "section_id" integer, CONSTRAINT "UQ_0ef25918f0237e68696dee455bd" UNIQUE ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6f5b25fefa74de22a1524c80b5" ON "lesson" ("section_id", "order") `);
        await queryRunner.query(`CREATE TABLE "page" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "page_number" integer NOT NULL, "text" varchar NOT NULL, "lesson_id" integer, CONSTRAINT "UQ_742f4117e065c5b6ad21b37ba1f" UNIQUE ("id"), CONSTRAINT "UQ_d5f769c3b37a1204bacdfc72e57" UNIQUE ("lesson_id", "page_number"))`);
        await queryRunner.query(`DROP INDEX "IDX_6f5b25fefa74de22a1524c80b5"`);
        await queryRunner.query(`CREATE TABLE "temporary_lesson" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "text" varchar NOT NULL, "order" integer NOT NULL, "section_id" integer, CONSTRAINT "UQ_0ef25918f0237e68696dee455bd" UNIQUE ("id"), CONSTRAINT "FK_a83099885c0ef3112edb9e12fd6" FOREIGN KEY ("section_id") REFERENCES "section" ("id_pk") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_lesson"("id_pk", "id", "text", "order", "section_id") SELECT "id_pk", "id", "text", "order", "section_id" FROM "lesson"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`ALTER TABLE "temporary_lesson" RENAME TO "lesson"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6f5b25fefa74de22a1524c80b5" ON "lesson" ("section_id", "order") `);
        await queryRunner.query(`CREATE TABLE "temporary_page" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "page_number" integer NOT NULL, "text" varchar NOT NULL, "lesson_id" integer, CONSTRAINT "UQ_742f4117e065c5b6ad21b37ba1f" UNIQUE ("id"), CONSTRAINT "UQ_d5f769c3b37a1204bacdfc72e57" UNIQUE ("lesson_id", "page_number"), CONSTRAINT "FK_8689d1913c2157e906a82753b01" FOREIGN KEY ("lesson_id") REFERENCES "lesson" ("id_pk") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_page"("id_pk", "id", "page_number", "text", "lesson_id") SELECT "id_pk", "id", "page_number", "text", "lesson_id" FROM "page"`);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`ALTER TABLE "temporary_page" RENAME TO "page"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "page" RENAME TO "temporary_page"`);
        await queryRunner.query(`CREATE TABLE "page" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "page_number" integer NOT NULL, "text" varchar NOT NULL, "lesson_id" integer, CONSTRAINT "UQ_742f4117e065c5b6ad21b37ba1f" UNIQUE ("id"), CONSTRAINT "UQ_d5f769c3b37a1204bacdfc72e57" UNIQUE ("lesson_id", "page_number"))`);
        await queryRunner.query(`INSERT INTO "page"("id_pk", "id", "page_number", "text", "lesson_id") SELECT "id_pk", "id", "page_number", "text", "lesson_id" FROM "temporary_page"`);
        await queryRunner.query(`DROP TABLE "temporary_page"`);
        await queryRunner.query(`DROP INDEX "IDX_6f5b25fefa74de22a1524c80b5"`);
        await queryRunner.query(`ALTER TABLE "lesson" RENAME TO "temporary_lesson"`);
        await queryRunner.query(`CREATE TABLE "lesson" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "text" varchar NOT NULL, "order" integer NOT NULL, "section_id" integer, CONSTRAINT "UQ_0ef25918f0237e68696dee455bd" UNIQUE ("id"))`);
        await queryRunner.query(`INSERT INTO "lesson"("id_pk", "id", "text", "order", "section_id") SELECT "id_pk", "id", "text", "order", "section_id" FROM "temporary_lesson"`);
        await queryRunner.query(`DROP TABLE "temporary_lesson"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_6f5b25fefa74de22a1524c80b5" ON "lesson" ("section_id", "order") `);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP INDEX "IDX_6f5b25fefa74de22a1524c80b5"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP TABLE "section"`);
    }

}

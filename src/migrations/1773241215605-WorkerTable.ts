import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkerTable1773241215605 implements MigrationInterface {
    name = "WorkerTable1773241215605";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "worker" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "email" varchar NOT NULL, "password_hash" varchar NOT NULL, "role" varchar NOT NULL DEFAULT ('editor'), "display_name" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_worker_id" UNIQUE ("id"), CONSTRAINT "UQ_worker_email" UNIQUE ("email"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "worker"`);
    }
}

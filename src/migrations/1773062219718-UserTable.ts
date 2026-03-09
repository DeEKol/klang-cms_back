import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1773062219718 implements MigrationInterface {
    name = 'UserTable1773062219718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id_pk" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id" varchar NOT NULL, "uid" varchar NOT NULL, "email" varchar, "displayName" varchar, "photoURL" varchar, "provider" varchar, "meta" json, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_cace4a159ff9f2512dd42373760" UNIQUE ("id"), CONSTRAINT "UQ_df955cae05f17b2bcf5045cc021" UNIQUE ("uid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

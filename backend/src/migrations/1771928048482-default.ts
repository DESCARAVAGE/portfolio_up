import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1771928048482 implements MigrationInterface {
    name = 'Default1771928048482'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cv" ("id" SERIAL NOT NULL, "filename" text NOT NULL, "mimeType" text NOT NULL, "size" integer NOT NULL, "url" text NOT NULL, "dateCreated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ddf7891daf83c3506efa503bb8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cv"`);
    }

}

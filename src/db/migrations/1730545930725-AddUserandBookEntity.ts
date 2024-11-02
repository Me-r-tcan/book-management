import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserandBookEntity1730545930725 implements MigrationInterface {
    name = 'AddUserandBookEntity1730545930725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_64b1e69016cecd7eebd00bdbeb4"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "addedById"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "addedById" integer`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_64b1e69016cecd7eebd00bdbeb4" FOREIGN KEY ("addedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}

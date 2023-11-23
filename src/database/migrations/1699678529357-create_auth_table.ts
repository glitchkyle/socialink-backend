import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class CreateAuthTable1699678529357 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "auth",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "auth_user_id",
                        type: "uuid",
                    },
                    {
                        name: "subject_id",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "access_token",
                        type: "varchar",
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: "refresh_token",
                        type: "varchar",
                        isNullable: true,
                        default: null,
                    },
                    {
                        name: "access_token_expires_at",
                        type: "timestamp",
                        isNullable: true,
                        default: null,
                    },
                ],
            })
        );

        await queryRunner.createForeignKey(
            "auth",
            new TableForeignKey({
                name: "FK_users_auth_user_id",
                columnNames: ["auth_user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("auth", "FK_users_auth_user_id");

        await queryRunner.dropTable("auth");
    }
}

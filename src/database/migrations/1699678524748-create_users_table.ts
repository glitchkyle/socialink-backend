import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createUserTable1687273740382 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
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
                        name: "username",
                        type: "varchar",
                    },
                    {
                        name: "email",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "full_name",
                        type: "varchar",
                    },
                    {
                        name: "profile_picture_url",
                        type: "varchar",
                    },
                    {
                        name: "locale",
                        type: "varchar",
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["Regular", "Admin"],
                        default: "'Regular'",
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}

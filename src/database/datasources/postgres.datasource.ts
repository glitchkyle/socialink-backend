import { DataSource } from "typeorm";
import { envs } from "../../config/env";

export const PostgresDataSource = new DataSource({
    type: "postgres",
    entities: ["src/entities/**/*.entity{.ts,.js}"],
    synchronize: false,
    migrations: ["src/database/migrations/**/*{.ts,.js}"],
    host: envs.DB_HOST,
    port: Number(envs.DB_PORT),
    username: envs.DB_USER_NAME,
    password: envs.DB_USER_PASSWORD,
    database: envs.DB_NAME,
});

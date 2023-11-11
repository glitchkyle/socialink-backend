import Logger from "../config/logger";
import { PostgresDataSource } from "../database/datasources/postgres.datasource";
import Auth from "../entities/auth.entity";

export const AuthRepository = PostgresDataSource.getRepository(Auth).extend({
    createAuth(auth: Auth) {
        Logger.debug("Creating new authentication");
        return auth.save();
    },
});

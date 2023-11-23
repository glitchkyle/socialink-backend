import { validate } from "class-validator";
import Logger from "../config/logger";
import { PostgresDataSource } from "../database/datasources/postgres.datasource";
import Auth from "../entities/auth.entity";
import { ResourceNotFoundError, ValidationException } from "../handlers/error";

export const AuthRepository = PostgresDataSource.getRepository(Auth).extend({
    async createAuth(auth: Auth) {
        Logger.debug("Creating new authentication");
        const errors = await validate(auth);
        if (errors.length) throw new ValidationException(errors);
        return auth.save();
    },
    findAuthUserByAuthSubjectId(subjectId: string) {
        Logger.debug(`Finding auth record by subject id ${subjectId}`);
        return Auth.findOne({
            where: { subjectId },
            relations: { user: true },
        });
    },
    async updateAccessTokenBySubjectId({
        subjectId,
        accessToken,
        accessTokenExpiry,
    }: {
        subjectId: string;
        accessToken: string;
        accessTokenExpiry: string;
    }) {
        Logger.debug(`Updating access token for user id ${subjectId}`);

        const auth = await Auth.findOne({ where: { subjectId } });
        if (!auth) throw new ResourceNotFoundError();

        auth.accessToken = accessToken;
        auth.accessTokenExpiresAt = new Date(Number(accessTokenExpiry) * 1000);

        return await auth.save();
    },
});

import { isEmail, validate } from "class-validator";

import { PostgresDataSource } from "../database/datasources/postgres.datasource";
import User from "../entities/user.entity";
import { BadRequestError, ValidationException } from "../handlers/error";
import Logger from "../config/logger";

export const UserRepository = PostgresDataSource.getRepository(User).extend({
    async createUser(user: User) {
        Logger.debug("Creating new user");
        const errors = await validate(user);
        if (errors.length) throw new ValidationException(errors);
        return user.save();
    },
    findUserByEmail(email: string) {
        Logger.debug(`Finding user with email ${email}`);
        if (!isEmail(email)) throw new BadRequestError("Invalid Email");
        return this.findOne({ where: { email } });
    },
});

import { validate } from "class-validator";

import Logger from "../config/logger";
import Auth from "../entities/auth.entity";
import User from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { AuthRepository } from "../repositories/auth.repository";
import { ValidationException } from "../handlers/error";

export async function createNewAuthenticatedUser({
    username,
    email,
    fullName,
    profilePictureUrl,
    locale,
    sub,
}: {
    // User information
    username: string;
    email: string;
    fullName: string;
    profilePictureUrl: string;
    locale: string;
    // Auth information
    sub: string;
}) {
    Logger.debug("Creating new authenticated user");

    const newUser = User.create({
        username,
        email,
        fullName,
        profilePictureUrl,
        locale,
    });

    const userErrors = await validate(newUser);
    if (userErrors.length) throw new ValidationException(userErrors);

    const user = await UserRepository.createUser(newUser);

    const newAuth = Auth.create({
        user,
        authId: sub,
    });

    const authErrors = await validate(newAuth);
    if (authErrors.length) throw new ValidationException(authErrors);

    await AuthRepository.createAuth(newAuth);

    return user;
}

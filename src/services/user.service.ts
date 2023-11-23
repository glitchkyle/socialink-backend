import { UserinfoResponse } from "openid-client";

import Logger from "../config/logger";
import Auth from "../entities/auth.entity";
import User from "../entities/user.entity";
import { UserRepository } from "../repositories/user.repository";
import { AuthRepository } from "../repositories/auth.repository";
import { MissingFieldError } from "../handlers/error";

export async function findOrCreateNewAuthenticatedUser({
    claims,
    accessToken,
    refreshToken,
    accessTokenExpiry,
}: {
    claims: UserinfoResponse;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: string;
}): Promise<User> {
    Logger.debug("Finding or creating new authenticated user");

    const { sub } = claims;

    const authUser = await AuthRepository.findAuthUserByAuthSubjectId(sub);

    if (authUser) {
        const { user } = authUser;

        if (!user) throw new MissingFieldError();

        await AuthRepository.updateAccessTokenBySubjectId({
            subjectId: sub,
            accessToken,
            accessTokenExpiry,
        });

        return user;
    } else {
        const { nickname, name, email, picture, locale } = claims;
        const newUser = User.create({
            fullName: name,
            username: nickname,
            profilePictureUrl: picture,
            email,
            locale,
        });

        const user = await UserRepository.createUser(newUser);

        const newAuth = Auth.create({
            user,
            subjectId: sub,
            accessToken,
            refreshToken,
            accessTokenExpiresAt: new Date(Number(accessTokenExpiry) * 1000),
        });

        await AuthRepository.createAuth(newAuth);

        return user;
    }
}

export async function findUserByEmail({ email }: { email: string }) {
    Logger.debug(`Finding user by email ${email}`);

    return await UserRepository.findUserByEmail(email);
}

import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "./async.middleware";
import { UserRepository } from "../repositories/user.repository";
import { MissingFieldError, UnauthorizedError } from "../handlers/error";
import { createNewAuthenticatedUser } from "../services/user.service";
import { EUserRole } from "../entities/user.entity";

interface UserInfo {
    sid: string;
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    picture: string;
    locale: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
    sub: string;
}

export const protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const user = req.oidc.user as UserInfo;

        if (!user.email) throw new MissingFieldError();
        const foundUser = await UserRepository.findUserByEmail(user.email);

        if (foundUser) {
            // TODO: Verify if new authentication was used
            req.user = foundUser;
            next();
        } else {
            const { nickname, name, email, picture, locale, sub } = user;

            req.user = await createNewAuthenticatedUser({
                // User Information
                username: nickname,
                fullName: name,
                email: email,
                profilePictureUrl: picture,
                locale: locale,
                // Authentication Information
                sub: sub,
            });
            next();
        }
    }
);

export const authorize = (...roles: EUserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { role } = req.user;
        if (role && !roles.includes(role)) throw new UnauthorizedError();
        next();
    };
};

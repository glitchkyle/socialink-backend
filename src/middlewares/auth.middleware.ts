import { NextFunction, Request, Response } from "express";
import { decodeJwt } from "jose";

import { UnauthorizedError } from "../handlers/error";
import { envs } from "../config/env";

export const authorize = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { accessToken } = req.oidc;
        if (!accessToken) throw new UnauthorizedError();
        const claims = decodeJwt(accessToken.access_token);
        const roles = claims[`${envs.AUDIENCE}/roles`] as string;
        if (!roles.includes(permission)) throw new UnauthorizedError();
        next();
    };
};

import { Request, Response, NextFunction } from "express";

import Logger from "../config/logger";
import { AppError, ValidationException } from "../handlers/error";
import { envs } from "../config/env";

export default function errorLogger(
    error: Error | AppError | ValidationException,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let err = new AppError(error.message, 500);

    // Logging the API request route
    const route = `${req.method} ${req.originalUrl}`;

    if (error instanceof ValidationException) {
        err = new AppError(error.message, error.statusCode);
        if (envs.NODE_ENV !== "production" && error.data.length > 0)
            Logger.error(error.data);
    } else if (error instanceof AppError) {
        err = new AppError(error.message, error.statusCode);
    }

    const userError = req.user ? `[User: ${req.user.id}]` : `[User: NONE]`;
    const routeError = `[Route: ${route}]`;
    const statusError = `[Error ${err.statusCode}]`;
    const metadataError = `${err.name}: ${err.message}`;
    Logger.error(`${userError} ${routeError} ${statusError} ${metadataError}`);

    if (envs.NODE_ENV !== "production") {
        Logger.debug("Debug Information (Stack & Data)");
        Logger.error(err.stack);
    }

    next(err);
}

import { Request, Response, NextFunction } from "express";

import { AppError } from "../handlers/error";

export default function errorFormatter(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.status(err.statusCode).send(err.message);
}

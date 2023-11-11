import { Request, Response, NextFunction } from "express";

export function asyncHandler(
    // eslint-disable-next-line
    fn: (...args: any) => any
): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

import { Request, Response, NextFunction, RequestHandler } from 'express';

export const catchAsyncUnauth = <
    Params = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
>(
    fn: (
        req: Request<Params, ResBody, ReqBody, ReqQuery>,
        res: Response<ResBody>,
        next: NextFunction
    ) => Promise<any>
): RequestHandler<Params, ResBody, ReqBody, ReqQuery> => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

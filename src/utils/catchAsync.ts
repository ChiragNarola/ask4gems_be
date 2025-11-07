import { Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../middlewares/authorize';

export const catchAsync = <
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: (
    req: AuthenticatedRequest,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<Params, ResBody, ReqBody, ReqQuery> => {
  return (req, res, next) => {
    Promise.resolve(
      fn(
        req as unknown as AuthenticatedRequest,
        res,
        next
      )
    ).catch(next);
  };
};

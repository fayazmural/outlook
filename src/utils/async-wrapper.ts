import { type Response, type NextFunction, type Request } from "express";

/**
 * A function that handles Express requests and returns a promise.
 */
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Wraps Request handler function.
 * @param func - The asynchronous request handler function.
 * @returns A new request handler function that handles errors.
 */
export const asyncWrapper = (func: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

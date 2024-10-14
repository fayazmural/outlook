import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { CustomAPIError } from "../errors/custom-error.js";
import { asyncWrapper } from "../utils/async-wrapper.js";
import { StatusCodes } from "http-status-codes";

const authenticateUser = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new CustomAPIError(
        "Unauthorized request",
        StatusCodes.UNAUTHORIZED
      );
    }
    try {
      const jwtSecret = process.env.JWT_ACCESS_SECRET as Secret;
      const payload = jwt.verify(token, jwtSecret) as JwtPayload;
      req.user = { userID: payload.userID as string };
      next();
    } catch (error) {
      throw new CustomAPIError(
        "Unauthorized request",
        StatusCodes.UNAUTHORIZED
      );
    }
  }
);

export default authenticateUser;

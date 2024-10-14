import jwt, { type Secret } from "jsonwebtoken";

/**
 * Generates an access JWT for a given user ID.
 * @param userID - The user ID for whom the access JWT is generated.
 * @returns  The generated access JWT.
 */
export const accessJWTGenerator = (userID: string): string => {
  const jwtSecret = process.env.JWT_ACCESS_SECRET as Secret;
  return jwt.sign({ userID }, jwtSecret, {
    expiresIn: process.env.JWT_ACCESS_LIFETIME,
  });
};

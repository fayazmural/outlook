import passport from "passport";
import OutlookStrategy from "passport-outlook";
import dotenv from "dotenv";
import { CustomAPIError } from "../errors/custom-error.js";
import { StatusCodes } from "http-status-codes";
import jwt, { type Secret, type JwtPayload } from "jsonwebtoken";
import { UserAuthenticationManager } from "../db/auth.js";

dotenv.config();

passport.use(
  new OutlookStrategy(
    {
      clientID: process.env.OUTLOOK_CLIENT_ID,
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
      callbackURL: process.env.OUTLOOK_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (
      req: any,
      accessToken: string,
      refreshToken: string | null,
      profile: any,
      done: (err: any, user?: any, info?: any) => void
    ) => {
      // Extract the token from cookies or headers
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return done(
          new CustomAPIError("Unauthorized request", StatusCodes.UNAUTHORIZED)
        );
      }

      try {
        // Verify the JWT token
        const jwtSecret = process.env.JWT_ACCESS_SECRET as Secret;
        const payload = jwt.verify(token, jwtSecret) as JwtPayload;
        const userId = payload.userID;

        // Fetch user details from the database
        const authManager = UserAuthenticationManager.getInstance();
        const userFromDB = await authManager.getUserById(userId);

        // Compare the Outlook email with the local account email
        const outlookEmail = profile._json.EmailAddress;
        if (userFromDB?.email !== outlookEmail) {
          return done(null, false, {
            message: "Outlook email does not match local account email.",
          });
        }

        // Create a user object to be returned
        const user = {
          id: userId, 
          name: profile.displayName,
          email: outlookEmail,
          accessToken: accessToken,
          refreshToken: refreshToken || null,
        };

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

export default passport;

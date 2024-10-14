import { type Request, type Response } from "express";
import { createCustomError } from "../errors/custom-error.js";
import { asyncWrapper } from "../utils/async-wrapper.js";
import { StatusCodes } from "http-status-codes";
import { UserAuthenticationManager } from "../db/auth.js";
import { comparePassword } from "../utils/password.js";
import { accessJWTGenerator } from "../utils/jwt-generator.js";
import { MailManager } from "../db/mail.js";

/**
 * Register a new user by validating the request body, checking if the user already exists,
 * and creating a new user in the database.
 */
export const register = asyncWrapper(async (req: Request, res: Response) => {
  const authManager = UserAuthenticationManager.getInstance();

  // Validate user data
  const validatedUser = await authManager.validateUser(req.body);

  // Check if user already exists
  const isUserExist = await authManager.getUser(req.body.email);
  if (isUserExist) {
    throw createCustomError("User Already Exists", StatusCodes.CONFLICT);
  }

  // Create new user
  const newUser = await authManager.createUser(validatedUser);

  // Respond with created user data
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Registration Successful", data: newUser });
});

/**
 * Log in a user by validating credentials and returning a JWT token.
 */
export const login = asyncWrapper(async (req: Request, res: Response) => {
  const authManager = UserAuthenticationManager.getInstance();
  const { email, password } = req.body;

  // Check if user exists
  const user = await authManager.getUser(email);
  if (!user) {
    throw createCustomError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
  }

  // Validate password
  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw createCustomError("Invalid Credentials", StatusCodes.UNAUTHORIZED);
  }

  // Generate JWT and set in a secure cookie
  const accessToken = accessJWTGenerator(user.id!);
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure flag set in production
    maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
  };

  res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .send({ message: "Login Successful" });
});

/**
 * Callback handler for Outlook authentication.
 * Syncs the user's emails and redirects to the mail page.
 */
export const authCallback = asyncWrapper(
  async (req: Request, res: Response) => {
    const { accessToken, id: userId } = req.user;
    const mailManager = MailManager.getInstance();

    // Sync emails for the authenticated user
    await mailManager.syncEmails(userId, accessToken);

    // Redirect to mail view
    res.redirect("/mails/display");
  }
);

/**
 * Handler for failed authentication attempts.
 */
export const failedAuth = (req: Request, res: Response) => {
  res
    .status(StatusCodes.UNAUTHORIZED)
    .json({ message: "Failed to authenticate with Outlook" });
};

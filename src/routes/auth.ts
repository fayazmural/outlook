import express from "express";
import { login, register } from "../controllers/auth.js";

export const authRouter = express.Router();


// Route for user registration
authRouter.route("/register").post(register);

// Route for user login
authRouter.route("/login").post(login);


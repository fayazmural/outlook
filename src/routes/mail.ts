import express from "express";
import { serveMailPage, getUserMails } from "../controllers/mail.js";

export const mailRouter = express.Router();

// Route to fetch user emails
mailRouter.route("/").get(getUserMails);

// Route to display the mail page
mailRouter.route("/display").get(serveMailPage);

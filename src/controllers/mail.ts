import { Request, Response } from "express";
import { asyncWrapper } from "../utils/async-wrapper.js";
import { MailManager } from "../db/mail.js";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Controller to fetch and return the user's emails.
 * Uses the MailManager to retrieve the emails for the authenticated user (req.user).
 */
export const getUserMails = asyncWrapper(
  async (req: Request, res: Response) => {
    const mailManager = MailManager.getInstance();
    const userEmails = await mailManager.getMails(req.user.userID);
    res
      .status(StatusCodes.OK)
      .json({ message: "Mails Fetched Successfully", data: userEmails });
  }
);

/**
 * Controller to serve the mail.html page.
 * Sends the HTML file that contains the user's mail interface.
 */
export const serveMailPage = asyncWrapper(
  async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../public/mail.html"));
  }
);

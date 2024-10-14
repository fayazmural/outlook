import { Router } from "express";
import passport from "passport";
import { authCallback, failedAuth } from "../controllers/auth.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const outLookRouter = Router();


// Route to initiate Outlook login with specific permissions (scope)
outLookRouter.get(
  "/",
  passport.authenticate("windowslive", {
    scope: [
      "openid",
      "profile",
      "offline_access",
      "https://outlook.office.com/Mail.Read",
    ],
  })
);


// Route to handle Outlook authentication callback and potential failures
outLookRouter.get(
  "/callback",
  passport.authenticate("windowslive", {
    failureRedirect: "/auth/outlook/failed",
  }),
  authCallback
);


// Route to serve the custom Outlook login page
outLookRouter.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/outlook-login.html"));
});


// Route for failed authentication
outLookRouter.get("/failed", failedAuth);

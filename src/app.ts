import express from "express";
import session from "express-session";
import passport from "./config/passportConfig.js";
import cookieParser from "cookie-parser";
import path from "path";
import { outLookRouter } from "./routes/outlook.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { notFound } from "./middleware/not-found.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.js";
import authenticateUser from "./middleware/auth.js";
import { mailRouter } from "./routes/mail.js";
import "./utils/initElasticsearch.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// Session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Authentication routes
app.use("/auth", authRouter);
app.use("/auth/outlook", authenticateUser, outLookRouter);

//Mail routes
app.use("/mails", authenticateUser, mailRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

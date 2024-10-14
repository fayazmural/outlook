import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

/**
 * Handles requests to non-existent routes and sends a 404 response.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Response} The Express response object with a 404 status code and a "Route does not exist" message.
 */
export const notFound = (req: Request, res: Response): Response =>
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route does not exist" });

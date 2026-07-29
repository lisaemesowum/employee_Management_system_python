import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app.error.js";
import { errorResponse } from "../response/api.response.js";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res
      .status(error.statusCode)
      .json(errorResponse(error.message, error.code, error.details));

    return;
  }

  console.error("Unhandled application error:", error);

  res
    .status(500)
    .json(
      errorResponse(
        "An unexpected server error occurred.",
        "INTERNAL_SERVER_ERROR",
      ),
    );
};
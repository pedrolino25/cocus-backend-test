import { Request, Response, NextFunction } from "express";
import { ApiError } from "./api-error";
import { ErrorCodes, ErrorMessages } from "./error.enums";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      status: err.status,
      error: err.code,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: 500,
    error: ErrorCodes.InternalServerError,
    message: ErrorMessages.InternalServerError,
  });
}

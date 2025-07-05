import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  res
    .status(err.statusCode || 500)
    .json({ error: err.message || "Error interno del servidor" });
}

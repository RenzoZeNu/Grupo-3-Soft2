import { Request, Response, NextFunction } from "express";

export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.user as { rol: string } | undefined;
  if (!user || user.rol !== "admin") {
    res.status(403).json({ error: "Requiere rol de administrador" });
    return;
  }
  next();
}

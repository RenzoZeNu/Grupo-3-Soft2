import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  correo: string;
  iat?: number;
  exp?: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (!payload.correo) {
      res.status(401).json({ error: "Token inválido (falta correo)" });
      return;
    }
    (req as any).usuario = { id: payload.id, correo: payload.correo };
    next();
  } catch (e) {
    res.status(401).json({ error: "Token inválido" });
  }
}




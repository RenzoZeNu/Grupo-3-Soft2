// warmikuna-backend/src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: number;
  correo: string;
  rol: "user" | "admin";
  iat?: number;
  exp?: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 1) Trata de leer Authorization con req.get()
  const authHeader = req.get("Authorization") || req.get("authorization");
  console.log(">>> authMiddleware.get Authorization:", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token no proporcionado" });
    return;
  }
  const token = authHeader.split(" ")[1];
  console.log(">>> authMiddleware token:", token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    (req as any).user = { id: payload.id, correo: payload.correo, rol: payload.rol };
    next();
  } catch (err) {
    console.error(">>> authMiddleware JWT error:", err);
    res.status(401).json({ error: "Token inválido" });
  }
}



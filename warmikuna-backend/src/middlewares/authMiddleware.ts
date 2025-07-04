import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // NOTA: no usamos "return res..." sino:
    res.status(401).json({ error: "Token no proporcionado" });
    return; // devolvemos void
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    // inyectamos el payload en req.usuario
    (req as any).usuario = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: "Token inválido" });
    return;
  }
}



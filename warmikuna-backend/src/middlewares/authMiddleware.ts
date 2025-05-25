import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Tipado extendido para agregar usuario al Request
declare global {
  namespace Express {
    interface Request {
      usuario?: { correo: string };
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { correo: string };
    req.usuario = { correo: decoded.correo };
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

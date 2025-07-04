import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        correo: string;
        idioma: string;
        modoDaltonico: boolean;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
      correo: string;
      idioma: string;
      modoDaltonico: boolean;
    };
    req.usuario = {
      id: decoded.id,
      correo: decoded.correo,
      idioma: decoded.idioma,
      modoDaltonico: decoded.modoDaltonico
    };
    next();
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
};


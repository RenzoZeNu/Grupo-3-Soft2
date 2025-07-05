// warmikuna-backend/src/controllers/UsuarioController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { usuarioService } from "../services/UsuarioService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UsuarioController {
  // POST /api/usuarios/registrar
  static async registrar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errores: errors.array() });
      return;
    }

    try {
      const { nombre, correo, password, dni } = req.body;
      const hashed = await bcrypt.hash(password, 10);
      const usuario = await usuarioService.crear({
        nombre,
        correo,
        password: hashed,
        dni,
      });
      res.status(201).json({ id: usuario.id, correo: usuario.correo });
    } catch (err: any) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(400).json({ error: "Correo ya registrado" });
        return;
      }
      next(err);
    }
  }

  // POST /api/usuarios/login
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validación fallida:", errors.array());
      res.status(400).json({ errores: errors.array() });
      return;
    }

    try {
      const { correo, password } = req.body;
      const user = await usuarioService.buscarPorCorreo(correo);
      if (!user) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ error: "Credenciales inválidas" });
        return;
      }

      const secret = process.env.JWT_SECRET;
      const expires = process.env.JWT_EXPIRES_IN || "1h";
      if (!secret) {
        next(new Error("JWT_SECRET no definido"));
        return;
      }

      const token = jwt.sign(
        { id: user.id, correo: user.correo, rol: user.rol },
        secret,
        { expiresIn: expires } as jwt.SignOptions
      );

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  // POST /api/usuarios/cambiar-contrasena
  static async cambiarContrasena(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errores: errors.array() });
      return;
    }

    try {
      const userId = (req as any).user.id as number;
      const { oldPassword, newPassword } = req.body;
      const user = await usuarioService.buscarPorId(userId);
      const ok = await bcrypt.compare(oldPassword, user.password);
      if (!ok) {
        res.status(400).json({ error: "Contraseña actual incorrecta" });
        return;
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await usuarioService.actualizarPassword(userId, hashed);
      res.json({ mensaje: "Contraseña actualizada" });
    } catch (err) {
      next(err);
    }
  }
}




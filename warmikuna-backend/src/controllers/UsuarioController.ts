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

      // Devolvemos token y datos del usuario
      res.json({
        token,
        usuario: {
          id: user.id,
          correo: user.correo,
          rol: user.rol
        }
      });
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
      const { correo, dni, password } = req.body;

      // 1. Busca usuario por correo
      const user = await usuarioService.buscarPorCorreo(correo);
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }

      // 2. Verifica que el DNI coincida
      if (user.dni !== dni) {
        res.status(400).json({ error: "DNI incorrecto" });
        return;
      }

      // 3. Hashea la nueva contraseña y actualiza
      const hashed = await bcrypt.hash(password, 10);
      await usuarioService.actualizarPassword(user.id, hashed);

      // 4. Responde éxito
      res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (err) {
      next(err);
    }
  }
}

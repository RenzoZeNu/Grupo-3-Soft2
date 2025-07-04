import { Request, Response, NextFunction } from "express";
import { usuarioService } from "../services/UsuarioService";

export class UsuarioController {
  /** POST /api/usuarios/registrar */
  static async registrar(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { nombre, correo, contrasena, dni } = req.body;
      if (!nombre || !correo || !contrasena || !dni) {
        res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        return;
      }

      const usuario = await usuarioService.registrar(
        nombre,
        correo,
        contrasena,
        dni
      );
      res
        .status(201)
        .json({ mensaje: "Usuario registrado exitosamente", usuario });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /** POST /api/usuarios/login */
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { correo, contrasena } = req.body;
      if (!correo || !contrasena) {
        res
          .status(400)
          .json({ mensaje: "Correo y contraseña son obligatorios" });
        return;
      }

      const { token, usuario } = await usuarioService.login(correo, contrasena);
      res.json({ mensaje: "Inicio de sesión exitoso", token, usuario });
    } catch (err: any) {
      res.status(401).json({ error: err.message });
    }
  }

  /** POST /api/usuarios/recuperar */
  static async recuperarContrasena(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { correo, dni, nuevaContrasena } = req.body;
      if (!correo || !dni || !nuevaContrasena) {
        res
          .status(400)
          .json({ mensaje: "Todos los campos son obligatorios" });
        return;
      }

      const result = await usuarioService.recuperarContrasena(
        correo,
        dni,
        nuevaContrasena
      );
      res.json({ mensaje: "Contraseña actualizada correctamente", ...result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  /** PUT /api/usuarios/preferencias */
  static async actualizarPreferencias(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).usuario.id as number;
      const { idioma, modoDaltonico } = req.body;

      const usuario = await usuarioService.actualizarPreferencias(
        userId,
        idioma,
        Boolean(modoDaltonico)
      );
      res
        .status(200)
        .json({ mensaje: "Preferencias actualizadas", usuario });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

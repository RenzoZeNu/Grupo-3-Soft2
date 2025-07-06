// File: warmikuna-backend/src/controllers/UsuarioController.ts

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
      res.status(201).json({ id: usuario.id, correo: usuario.correo, rol: usuario.rol });
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
      const secret = process.env.JWT_SECRET!;
      const expires = process.env.JWT_EXPIRES_IN || "1h";
      const token = jwt.sign(
        { id: user.id, correo: user.correo, rol: user.rol },
        secret,
        { expiresIn: expires }
      );
      res.json({
        token,
        usuario: {
          id: user.id,
          correo: user.correo,
          rol: user.rol,
        },
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
      const user = await usuarioService.buscarPorCorreo(correo);
      if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
      }
      if (user.dni !== dni) {
        res.status(400).json({ error: "DNI incorrecto" });
        return;
      }
      const hashed = await bcrypt.hash(password, 10);
      await usuarioService.actualizarPassword(user.id, hashed);
      res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (err) {
      next(err);
    }
  }

  // HU-16a – Listar todos los usuarios (solo admin)
  static async obtenerTodos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuario = (req as any).user;
      if (!usuario || usuario.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const lista = await usuarioService.obtenerTodos();
      res.status(200).json(lista);
    } catch (err) {
      console.error("❌ obtenerTodosUsuarios:", err);
      res.status(500).json({ error: "Error interno obteniendo usuarios" });
    }
  }

  // HU-16d – Eliminar usuario (solo admin)
  static async eliminarUsuario(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuario = (req as any).user;
      if (!usuario || usuario.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const id = parseInt(req.params.id, 10);
      const objetivo = await usuarioService.buscarPorId(id);
      if (objetivo.rol === "admin") {
        res.status(400).json({ error: "No puedes eliminar a otro admin" });
        return;
      }
      await usuarioService.eliminar(id);
      res.status(204).send();
    } catch (err) {
      console.error("❌ eliminarUsuario:", err);
      res.status(500).json({ error: "Error interno al eliminar usuario" });
    }
  }
}

// src/controllers/UsuarioController.ts

import { Request, Response, NextFunction } from "express";
import { usuarioService } from "../services/UsuarioService";
import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";

const usuarioRepository = AppDataSource.getRepository(Usuario);

export class UsuarioController {
  /** REGISTRAR */
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

      // Verificar duplicados
      const existe = await usuarioRepository.findOne({
        where: [{ correo }, { dni }],
      });
      if (existe) {
        res
          .status(400)
          .json({ mensaje: "El correo o DNI ya están registrados" });
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
        .json({ mensaje: "Usuario registrado con éxito", usuario });
    } catch (error: any) {
      // Puedes enviar el error al handler de errores si lo tienes
      res.status(400).json({ error: error.message });
    }
  }

  /** LOGIN */
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
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /** RECUPERAR CONTRASEÑA */
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

      await usuarioService.recuperarContrasena(
        correo,
        dni,
        nuevaContrasena
      );
      res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /** HU-12 / HU-13: ACTUALIZAR PREFERENCIAS */
  static async actualizarPreferencias(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // authMiddleware debe haber inyectado el payload en req.usuario
      const userId = (req as any).usuario.id as number;
      const { idioma, modoDaltonico } = req.body;

      const actualizado = await usuarioService.actualizarPreferencias(
        userId,
        idioma,
        Boolean(modoDaltonico)
      );
      res
        .status(200)
        .json({ mensaje: "Preferencias actualizadas", actualizado });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

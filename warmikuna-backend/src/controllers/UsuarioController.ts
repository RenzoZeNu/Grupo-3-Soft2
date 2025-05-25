import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";
import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";

const usuarioService = new UsuarioService();
const usuarioRepository = AppDataSource.getRepository(Usuario);

export class UsuarioController {
  static async registrar(req: Request, res: Response) {
    const { nombre, correo, contrasena, dni } = req.body;

    if (!nombre || !correo || !contrasena || !dni) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
      // Verificar si ya existe un usuario con el mismo correo o DNI
      const usuarioExistente = await usuarioRepository.findOne({
        where: [
          { correo },
          { dni }
        ]
      });

      if (usuarioExistente) {
        return res.status(400).json({ mensaje: "El correo o DNI ya están registrados" });
      }

      const usuario = await usuarioService.registrar(nombre, correo, contrasena, dni);
      res.status(201).json({ mensaje: "Usuario registrado con éxito", usuario });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
    }

    try {
      const { token, usuario } = await usuarioService.login(correo, contrasena);
      res.json({ mensaje: "Inicio de sesión exitoso", token, usuario });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async recuperarContrasena(req: Request, res: Response) {
    const { correo, dni, nuevaContrasena } = req.body;

    if (!correo || !dni || !nuevaContrasena) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    try {
      await usuarioService.recuperarContrasena(correo, dni, nuevaContrasena);
      res.json({ mensaje: "Contraseña actualizada correctamente" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

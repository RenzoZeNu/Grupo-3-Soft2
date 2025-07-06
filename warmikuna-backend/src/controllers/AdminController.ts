// File: warmikuna-backend/src/controllers/AdminController.ts

import { Request, Response, NextFunction } from "express";
import { denunciaService } from "../services/DenunciaService";
import { usuarioService } from "../services/UsuarioService";

export class AdminController {
  // GET  /api/admin/denuncias
  public static async listarDenuncias(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || user.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const lista = await denunciaService.obtenerTodas();
      res.status(200).json(lista);
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/admin/denuncias/:id/estado
  public static async cambiarEstado(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || user.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const id = Number(req.params.id);
      const { estado } = req.body as { estado: string };
      const updated = await denunciaService.actualizarEstado(id, estado);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  // GET  /api/admin/usuarios
  public static async listarUsuarios(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || user.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const lista = await usuarioService.obtenerTodos();
      res.status(200).json(lista);
    } catch (err) {
      next(err);
    }
  }

  // PATCH /api/admin/usuarios/:id/rol
  public static async actualizarRol(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || user.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const id = Number(req.params.id);
      const { rol } = req.body as { rol: "user" | "admin" };
      const updated = await usuarioService.actualizarRol(id, rol);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/admin/usuarios/:id
  public static async eliminarUsuario(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user || user.rol !== "admin") {
        res.status(403).json({ error: "No autorizado" });
        return;
      }
      const id = Number(req.params.id);
      await usuarioService.eliminar(id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
}

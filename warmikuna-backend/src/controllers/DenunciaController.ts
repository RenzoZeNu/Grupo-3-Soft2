// File: warmikuna-backend/src/controllers/DenunciaController.ts

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { denunciaService } from "../services/DenunciaService";
import { enviarCorreo } from "../utils/emailService";

export class DenunciaController {
  /** POST /api/denuncias */
  public static async crear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correo = (req as any).user?.correo as string | undefined;
      if (!correo) {
        res.status(400).json({ error: "Correo no disponible" });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errores: errors.array() });
        return;
      }

      const { descripcion, anonima = false } = req.body;
      const denuncia = await denunciaService.crear(
        correo,
        descripcion,
        anonima
      );

      enviarCorreo(
        correo,
        "Confirmación de Registro de Denuncia",
        `<p>Hola,</p><p>Tu denuncia fue registrada exitosamente.</p><p><strong>ID:</strong> ${denuncia.id}</p>`
      ).catch((e) => console.error("⚠️ Error enviando correo:", e));

      res.status(201).json(denuncia);
    } catch (err) {
      console.error("❌ crearDenuncia:", err);
      res.status(500).json({ error: "Error interno al crear denuncia" });
    }
  }

  /** POST /api/denuncias/con-evidencia */
  public static async crearConArchivo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correo = (req as any).user?.correo as string | undefined;
      if (!correo) {
        res.status(400).json({ error: "Correo no disponible" });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errores: errors.array() });
        return;
      }

      const { descripcion, anonima = false } = req.body;
      const evidenciaArchivo = req.file?.filename ?? null;
      const denuncia = await denunciaService.crearConArchivo(
        correo,
        descripcion,
        anonima,
        evidenciaArchivo
      );

      enviarCorreo(
        correo,
        "Confirmación de Denuncia con Evidencia",
        `<p>Hola,</p><p>Tu denuncia con evidencia fue registrada exitosamente.</p><p><strong>ID:</strong> ${denuncia.id}</p>`
      ).catch((e) => console.error("⚠️ Error enviando correo (evidencia):", e));

      res.status(201).json(denuncia);
    } catch (err) {
      console.error("❌ crearDenunciaConArchivo:", err);
      res
        .status(500)
        .json({ error: "Error interno al crear denuncia con archivo" });
    }
  }

  /** HU-14 – Obtener todas las denuncias (solo admin) */
  public static async obtenerTodas(
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
      const lista = await denunciaService.obtenerTodas();
      res.status(200).json(lista);
    } catch (err) {
      console.error("❌ obtenerTodas:", err);
      res.status(500).json({ error: "Error interno obteniendo denuncias" });
    }
  }

  /** HU-19c – Listar denuncias de un usuario */
  public static async obtenerPorUsuario(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correo = (req as any).user?.correo as string | undefined;
      if (!correo) {
        res.status(400).json({ error: "Correo no disponible" });
        return;
      }
      const lista = await denunciaService.obtenerPorCorreo(correo);
      res.status(200).json(lista);
    } catch (err) {
      console.error("❌ obtenerPorUsuario:", err);
      res.status(500).json({ error: "Error interno obteniendo denuncias" });
    }
  }

  /** HU-15 – Actualizar estado de una denuncia (solo admin) */
  public static async actualizarEstado(
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
      const { estado } = req.body;
      const updated = await denunciaService.actualizarEstado(id, estado);
      res.status(200).json(updated);
    } catch (err) {
      console.error("❌ actualizarEstado:", err);
      res.status(500).json({ error: "Error interno actualizando estado" });
    }
  }
}

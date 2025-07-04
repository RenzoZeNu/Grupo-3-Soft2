import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { denunciaService } from "../services/DenunciaService";
import { enviarCorreo } from "../utils/emailService";

export class DenunciaController {
  /** GET /api/denuncias */
  public static async obtenerPorUsuario(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const usuario = (req as any).usuario;
      const correo = usuario?.correo as string | undefined;
      if (!correo) {
        res.status(401).json({ error: "No autenticado" });
        return;
      }
      const lista = await denunciaService.obtenerPorCorreo(correo);
      res.status(200).json(lista);
    } catch (err) {
      console.error("❌ obtenerPorUsuario:", err);
      res.status(500).json({ error: "Error interno obteniendo denuncias" });
    }
  }

  /** POST /api/denuncias */
  public static async crear(
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
      const usuario = (req as any).usuario;
      const correo = usuario?.correo as string | undefined;
      if (!correo) {
        res.status(401).json({ error: "No autenticado" });
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
        `<p>Tu denuncia fue registrada.</p><p>ID: ${denuncia.id}</p>`
      ).catch((e) => console.error(e));

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errores: errors.array() });
      return;
    }

    try {
      const usuario = (req as any).usuario;
      const correo = usuario?.correo as string | undefined;
      if (!correo) {
        res.status(401).json({ error: "No autenticado" });
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
        `<p>Recibimos tu denuncia con evidencia.</p><p>ID: ${denuncia.id}</p>`
      ).catch((e) => console.error(e));

      res.status(201).json(denuncia);
    } catch (err) {
      console.error("❌ crearDenunciaConArchivo:", err);
      res
        .status(500)
        .json({ error: "Error interno al crear denuncia con archivo" });
    }
  }
}


// warmikuna-backend/src/controllers/DenunciaController.ts
import { Request, Response, NextFunction } from "express";
import { validationResult }                from "express-validator";
import { denunciaService }                from "../services/DenunciaService";
import { enviarCorreo }                   from "../utils/emailService";

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

  /** GET /api/denuncias */
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
}



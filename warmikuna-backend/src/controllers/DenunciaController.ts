// src/controllers/DenunciaController.ts
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
    // 1) Validación de body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errores: errors.array() });
      return;
    }

    try {
      const usuario = (req as any).usuario;
      const correo = usuario?.correo as string | undefined;
      if (!correo) {
        res.status(401).json({ error: "No autenticado (falta correo en token)" });
        return;
      }

      const { descripcion, anonima } = req.body;
      const anonimaBool =
        typeof anonima === "string"
          ? anonima.toLowerCase() === "true"
          : Boolean(anonima);

      const denuncia = await denunciaService.crear(
        correo,
        descripcion,
        anonimaBool
      );

      // envío de correo (fire-and-forget)
      enviarCorreo(
        correo,
        "Confirmación de Registro de Denuncia",
        `<p>Hola,</p>
         <p>Tu denuncia fue registrada correctamente.</p>
         <p><strong>ID:</strong> ${denuncia.id}</p>`
      ).catch((err) => console.error("⚠️ Error enviando correo:", err));

      res.status(201).json({ mensaje: "Denuncia creada", denuncia });
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
        res.status(401).json({ error: "No autenticado (falta correo en token)" });
        return;
      }

      const { descripcion, anonima } = req.body;
      const evidenciaArchivo = req.file?.filename ?? null;
      const anonimaBool =
        typeof anonima === "string"
          ? anonima.toLowerCase() === "true"
          : Boolean(anonima);

      const denuncia = await denunciaService.crearConArchivo(
        correo,
        descripcion,
        anonimaBool,
        evidenciaArchivo
      );

      enviarCorreo(
        correo,
        "Confirmación de Denuncia (con evidencia)",
        `<p>Hola,</p>
         <p>Recibimos tu denuncia con evidencia.</p>
         <p><strong>ID:</strong> ${denuncia.id}</p>`
      ).catch((err) =>
        console.error("⚠️ Error enviando correo (evidencia):", err)
      );

      res
        .status(201)
        .json({ mensaje: "Denuncia con archivo creada", denuncia });
    } catch (err) {
      console.error("❌ crearDenunciaConArchivo:", err);
      res
        .status(500)
        .json({ error: "Error interno al crear denuncia con archivo" });
    }
  }
}






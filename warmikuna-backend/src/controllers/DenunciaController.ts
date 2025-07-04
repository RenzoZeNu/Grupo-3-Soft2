import { Request, Response, NextFunction } from "express";
import { denunciaService }                from "../services/DenunciaService";
import { enviarCorreo }                   from "../utils/emailService";

export class DenunciaController {
  /** HU-19 – Registrar denuncia y enviar confirmación por correo */
  public static async crear(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correo = (req as any).usuario?.correo;
      if (!correo) {
        res.status(400).json({ error: "Correo no disponible" });
        return;
      }
      const { descripcion, anonima } = req.body;
      const denuncia = await denunciaService.crear(
        correo,
        descripcion,
        !!anonima
      );

      // envío de correo de confirmación
      try {
        await enviarCorreo(
          correo,
          "Confirmación de Registro de Denuncia",
          `<p>Hola,</p>
           <p>Tu denuncia fue registrada exitosamente.</p>
           <p><strong>ID:</strong> ${denuncia.id}</p>`
        );
      } catch (e) {
        console.error("⚠️ Error enviando correo de confirmación:", e);
      }

      res.status(201).json({ mensaje: "Denuncia creada", denuncia });
    } catch (err) {
      console.error("❌ crearDenuncia:", err);
      res.status(500).json({ error: "Error interno al crear denuncia" });
    }
  }

  /** HU-19b – Registrar denuncia con archivo y enviar confirmación */
  public static async crearConArchivo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correo = (req as any).usuario?.correo;
      if (!correo) {
        res.status(400).json({ error: "Correo no disponible" });
        return;
      }
      const { descripcion, anonima } = req.body;
      const evidenciaArchivo = req.file?.filename ?? null;
      const denuncia = await denunciaService.crearConArchivo(
        correo,
        descripcion,
        !!anonima,
        evidenciaArchivo
      );

      // envío de correo de confirmación con evidencia
      try {
        await enviarCorreo(
          correo,
          "Confirmación de Registro de Denuncia (con evidencia)",
          `<p>Hola,</p>
           <p>Tu denuncia con evidencia fue registrada.</p>
           <p><strong>ID:</strong> ${denuncia.id}</p>`
        );
      } catch (e) {
        console.error("⚠️ Error enviando correo de confirmación (evidencia):", e);
      }

      res.status(201).json({ mensaje: "Denuncia con archivo creada", denuncia });
    } catch (err) {
      console.error("❌ crearDenunciaConArchivo:", err);
      res.status(500).json({ error: "Error interno al crear denuncia con archivo" });
    }
  }

  /** HU-19c – Obtener denuncias del usuario autenticado */
  public static async obtenerPorUsuario(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const correo = (req as any).usuario?.correo;
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

  /** HU-20 – Actualizar estado y notificar por correo */
  public static async actualizarEstado(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;

      const denuncia = await denunciaService.buscarPorId(id);
      if (!denuncia) {
        res.status(404).json({ error: "Denuncia no encontrada" });
        return;
      }

      const actualizada = await denunciaService.actualizarEstado(id, estado);

      // envío de correo de actualización de estado
      try {
        await enviarCorreo(
          denuncia.correo_usuario,
          "Actualización de Estado de Denuncia",
          `<p>Hola,</p>
           <p>El estado de tu denuncia <strong>${id}</strong> es ahora: <strong>${estado}</strong>.</p>`
        );
      } catch (e) {
        console.error("⚠️ Error enviando correo de estado:", e);
      }

      res.status(200).json({ mensaje: "Estado actualizado", denuncia: actualizada });
    } catch (err) {
      console.error("❌ actualizarEstado:", err);
      res.status(500).json({ error: "Error interno actualizando estado" });
    }
  }
}



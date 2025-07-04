import { Request, Response } from "express";
import { denunciaService } from "../services/DenunciaService";
import { enviarCorreo } from "../utils/emailService";

export class DenunciaController {
  public static async crear(req: Request, res: Response): Promise<void> {
    try {
      const { descripcion, anonima } = req.body;
      // En tu middleware de autenticación guardas el usuario en req.usuario
      const correo = (req as any).usuario?.correo ?? req.body.correo_usuario;

      if (!correo) {
        res.status(400).json({ error: "Correo no disponible en la solicitud" });
        return;
      }

      /* Guarda la denuncia en BD */
      const denuncia = await denunciaService.crear(
        correo,
        descripcion,
        anonima === "true" || anonima === true
      );

      /* Enviar correo de confirmación */
      try {
        await enviarCorreo(
          correo,
          "Confirmación de Registro de Denuncia",
          `<p>Hola,</p>
           <p>Tu denuncia fue registrada exitosamente.</p>
           <p><strong>Código de denuncia:</strong> ${denuncia.id}</p>
           <p>Gracias por confiar en Warmikuna.</p>`
        );
      } catch (mailErr) {
        console.error("⚠️  Error enviando correo de confirmación:", mailErr);
      }

      res.status(201).json({ mensaje: "Denuncia creada exitosamente", denuncia });
    } catch (err) {
      console.error("❌  Error al crear denuncia:", err);
      res.status(500).json({ error: "Error interno al crear denuncia" });
    }
  }

  public static async actualizarEstado(req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;

      const denuncia = await denunciaService.buscarPorId(id);
      if (!denuncia) {
        res.status(404).json({ error: "Denuncia no encontrada" });
        return;
      }

      const denunciaActualizada = await denunciaService.actualizarEstado(id, estado);

      /* Enviar correo de actualización de estado */
      try {
        await enviarCorreo(
          denuncia.correo_usuario,
          "Actualización del Estado de tu Denuncia",
          `<p>Hola,</p>
           <p>El estado de tu denuncia <strong>${denuncia.id}</strong> se actualizó a: 
           <strong>${estado}</strong>.</p>
           <p>Gracias por usar Warmikuna.</p>`
        );
      } catch (mailErr) {
        console.error("⚠️  Error enviando correo de actualización:", mailErr);
      }

      res.status(200).json({
        mensaje: "Estado actualizado correctamente",
        denuncia: denunciaActualizada
      });
    } catch (err) {
      console.error("❌  Error al actualizar estado:", err);
      res.status(500).json({ error: "Error interno al actualizar estado" });
    }
  }
}

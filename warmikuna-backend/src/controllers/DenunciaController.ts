import { Request, Response } from "express";
import { DenunciaService } from "../services/DenunciaService";

const denunciaService = new DenunciaService();

export class DenunciaController {
  static async crear(req: Request, res: Response) {
    const { descripcion, anonima } = req.body;
    const usuarioId = req.user?.id;
    const dni = req.user?.dni;

    if (!descripcion) {
      return res.status(400).json({ error: "La descripción es obligatoria" });
    }

    // Validar si denuncia no es anónima pero el usuario no tiene un DNI válido
    if (anonima === false && (!dni || dni.length !== 8)) {
      return res.status(400).json({ error: "El usuario no tiene un DNI válido para denunciar de forma autenticada" });
    }

    try {
      const denuncia = await denunciaService.crear(usuarioId, descripcion, anonima ?? true);
      res.status(201).json({ mensaje: "Denuncia registrada con éxito", denuncia });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async listarPorUsuario(req: Request, res: Response) {
  const usuarioId = req.user?.id;

  try {
    const denuncias = await denunciaService.obtenerPorUsuario(usuarioId);
    res.json({ denuncias });
  } catch (error: any) {
    res.status(500).json({ error: "Error al obtener denuncias" });
  }
}

}


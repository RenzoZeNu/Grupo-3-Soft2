import { Request, Response } from "express";
import { EvidenciaService } from "../services/EvidenciaService";

const evidenciaService = new EvidenciaService();

export class EvidenciaController {
  static async adjuntar(req: Request, res: Response) {
    const { denunciaId, tipo, url } = req.body;

    if (!denunciaId || !tipo || !url) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
      const evidencia = await evidenciaService.adjuntar(denunciaId, tipo, url);
      res.status(201).json({ mensaje: "Evidencia adjuntada correctamente", evidencia });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

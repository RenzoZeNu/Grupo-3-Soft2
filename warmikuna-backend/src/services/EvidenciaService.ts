import { AppDataSource } from "../database/data-source";
import { Evidencia } from "../entities/Evidencia";
import { Denuncia } from "../entities/Denuncia";

export class EvidenciaService {
  private evidenciaRepo = AppDataSource.getRepository(Evidencia);
  private denunciaRepo = AppDataSource.getRepository(Denuncia);

  async adjuntar(denunciaId: number, tipo: string, url: string) {
    const denuncia = await this.denunciaRepo.findOneBy({ id: denunciaId });
    if (!denuncia) throw new Error("Denuncia no encontrada");

    const evidencia = this.evidenciaRepo.create({
      tipo,
      url,
      denuncia,
    });

    return await this.evidenciaRepo.save(evidencia);
  }
}

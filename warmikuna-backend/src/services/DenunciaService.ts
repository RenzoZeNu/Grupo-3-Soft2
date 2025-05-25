import { AppDataSource } from "../database/data-source";
import { Denuncia } from "../entities/Denuncia";

class DenunciaService {
  private denunciaRepository = AppDataSource.getRepository(Denuncia);

  async crear(correo: string, descripcion: string, anonima: boolean) {
    const denuncia = this.denunciaRepository.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      correo_usuario: correo,
    });

    return this.denunciaRepository.save(denuncia);
  }

  async crearConArchivo(correo: string, descripcion: string, anonima: boolean, evidenciaArchivo: string | null) {
    const denuncia = this.denunciaRepository.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo: evidenciaArchivo ?? null,
      correo_usuario: correo,
    });

    return this.denunciaRepository.save(denuncia);
  }

  async obtenerPorCorreo(correo: string) {
    return this.denunciaRepository.find({
      where: { correo_usuario: correo },
      order: { creada_en: "DESC" },
    });
  }
}

export const denunciaService = new DenunciaService();

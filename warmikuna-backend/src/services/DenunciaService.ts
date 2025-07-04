import { AppDataSource } from "../database/data-source";
import { Denuncia } from "../entities/Denuncia";

class DenunciaService {
  private denunciaRepository = AppDataSource.getRepository(Denuncia);

  /** Crea una denuncia sin archivo (HU-19) */
  async crear(correo: string, descripcion: string, anonima: boolean) {
    const denuncia = this.denunciaRepository.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      correo_usuario: correo
    });

    return this.denunciaRepository.save(denuncia);
  }

  /** Crea una denuncia con archivo adjunto */
  async crearConArchivo(
    correo: string,
    descripcion: string,
    anonima: boolean,
    evidenciaArchivo: string | null
  ) {
    const denuncia = this.denunciaRepository.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo: evidenciaArchivo ?? null,
      correo_usuario: correo
    });

    return this.denunciaRepository.save(denuncia);
  }

  /** Obtiene todas las denuncias de un usuario */
  async obtenerPorCorreo(correo: string) {
    return this.denunciaRepository.find({
      where: { correo_usuario: correo },
      order: { creada_en: "DESC" }
    });
  }
  /** Busca una denuncia por su ID */
  async buscarPorId(id: number) {
    return this.denunciaRepository.findOne({ where: { id } });
  }

  /** Actualiza únicamente el estado de una denuncia */
  async actualizarEstado(id: number, nuevoEstado: string) {
    const denuncia = await this.denunciaRepository.findOne({ where: { id } });
    if (!denuncia) return null;

    denuncia.estado = nuevoEstado;
    return this.denunciaRepository.save(denuncia);
  }
}

export const denunciaService = new DenunciaService();

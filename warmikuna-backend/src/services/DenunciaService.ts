import { AppDataSource } from "../database/data-source";
import { Denuncia } from "../entities/Denuncia";

class DenunciaService {
  private repo = AppDataSource.getRepository(Denuncia);

  /** Crea una denuncia sin archivo */
  async crear(correo: string, descripcion: string, anonima: boolean) {
    const d = this.repo.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      correo_usuario: correo,
    });
    return this.repo.save(d);
  }

  /** Crea una denuncia con archivo adjunto */
  async crearConArchivo(
    correo: string,
    descripcion: string,
    anonima: boolean,
    evidenciaArchivo: string | null
  ) {
    const d = this.repo.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo: evidenciaArchivo ?? null,
      correo_usuario: correo,
    });
    return this.repo.save(d);
  }

  /** Obtiene todas las denuncias de un usuario */
  async obtenerPorCorreo(correo: string) {
    return this.repo.find({
      where: { correo_usuario: correo },
      order: { creada_en: "DESC" },
    });
  }

  /** Busca una denuncia por su ID (HU-20) */
  async buscarPorId(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  /** Actualiza únicamente el estado de una denuncia (HU-20) */
  async actualizarEstado(id: number, nuevoEstado: string) {
    const d = await this.repo.findOne({ where: { id } });
    if (!d) return null;
    d.estado = nuevoEstado;
    return this.repo.save(d);
  }
}

export const denunciaService = new DenunciaService();

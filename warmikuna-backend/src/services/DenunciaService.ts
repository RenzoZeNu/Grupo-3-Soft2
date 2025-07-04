import { AppDataSource } from "../database/data-source";
import { Denuncia }      from "../entities/Denuncia";

class DenunciaService {
  private denunciaRepository = AppDataSource.getRepository(Denuncia);

  async crear(
    correo: string,
    descripcion: string,
    anonima: boolean
  ): Promise<Denuncia> {
    const denuncia = this.denunciaRepository.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo: null,
      correo_usuario: correo,
    });
    return this.denunciaRepository.save(denuncia);
  }

  async crearConArchivo(
    correo: string,
    descripcion: string,
    anonima: boolean,
    evidenciaArchivo: string | null
  ): Promise<Denuncia> {
    const denuncia = this.denunciaRepository.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo,
      correo_usuario: correo,
    });
    return this.denunciaRepository.save(denuncia);
  }

  async obtenerPorCorreo(correo: string): Promise<Denuncia[]> {
    return this.denunciaRepository.find({
      where: { correo_usuario: correo },
      order: { creada_en: "DESC" },
    });
  }

  async buscarPorId(id: number): Promise<Denuncia | null> {
    return this.denunciaRepository.findOneBy({ id });
  }

  async actualizarEstado(
    id: number,
    nuevoEstado: string
  ): Promise<Denuncia> {
    const denuncia = await this.buscarPorId(id);
    if (!denuncia) throw new Error("Denuncia no encontrada");
    denuncia.estado = nuevoEstado;
    return this.denunciaRepository.save(denuncia);
  }
}

export const denunciaService = new DenunciaService();


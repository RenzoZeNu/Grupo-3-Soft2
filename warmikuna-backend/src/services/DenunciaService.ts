import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Denuncia } from "../entities/Denuncia";

export class DenunciaService {
  private repo: Repository<Denuncia>;

  constructor() {
    this.repo = AppDataSource.getRepository(Denuncia);
  }

  // HU-19 – crear denuncia sin archivo
  async crear(
    correo: string,
    descripcion: string,
    anonima: boolean
  ): Promise<Denuncia> {
    const denuncia = this.repo.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo: null,
      correo_usuario: correo,
    });
    return this.repo.save(denuncia);
  }

  // HU-19b – crear denuncia con archivo
  async crearConArchivo(
    correo: string,
    descripcion: string,
    anonima: boolean,
    evidenciaArchivo: string | null
  ): Promise<Denuncia> {
    const denuncia = this.repo.create({
      descripcion,
      anonima,
      estado: "en revisión",
      creada_en: new Date(),
      evidenciaArchivo,
      correo_usuario: correo,
    });
    return this.repo.save(denuncia);
  }

  // HU-19c – listar denuncias de un usuario
  async obtenerPorCorreo(correo: string): Promise<Denuncia[]> {
    return this.repo.find({
      where: { correo_usuario: correo },
      order: { creada_en: "DESC" },
    });
  }

  // HU-14 – listar todas las denuncias (admin)
  async obtenerTodas(): Promise<Denuncia[]> {
    return this.repo.find({
      order: { creada_en: "DESC" }
    });
  }

  // HU-15 – actualizar estado de una denuncia (admin)
  async actualizarEstado(id: number, estado: string): Promise<Denuncia> {
    await this.repo.update(id, { estado });
    return this.repo.findOneByOrFail({ id });
  }
}

export const denunciaService = new DenunciaService();

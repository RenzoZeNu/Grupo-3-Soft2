// src/services/DenunciaService.ts
import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Denuncia } from "../entities/Denuncia";

export class DenunciaService {
  private denunciaRepository: Repository<Denuncia>;

  constructor() {
    this.denunciaRepository = AppDataSource.getRepository(Denuncia);
  }

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
      correo_usuario: anonima ? null : correo,
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
      correo_usuario: anonima ? null : correo,
    });
    return this.denunciaRepository.save(denuncia);
  }
}

export const denunciaService = new DenunciaService();






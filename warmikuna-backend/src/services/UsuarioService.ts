// warmikuna-backend/src/services/UsuarioService.ts
import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Usuario }      from "../entities/Usuario";

export class UsuarioService {
  private repo: Repository<Usuario>;

  constructor() {
    this.repo = AppDataSource.getRepository(Usuario);
  }

  crear(data: {
    nombre: string;
    correo: string;
    password: string;
    dni: string;
  }): Promise<Usuario> {
    const u = this.repo.create(data);
    return this.repo.save(u);
  }

  buscarPorCorreo(correo: string): Promise<Usuario | null> {
    return this.repo.findOneBy({ correo });
  }

  buscarPorId(id: number): Promise<Usuario> {
    return this.repo.findOneByOrFail({ id });
  }

  async actualizarPassword(id: number, hashed: string): Promise<void> {
    await this.repo.update(id, { password: hashed });
  }
}

export const usuarioService = new UsuarioService();




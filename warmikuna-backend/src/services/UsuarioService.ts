// File: warmikuna-backend/src/services/UsuarioService.ts

import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";

export class UsuarioService {
  private repo: Repository<Usuario>;

  constructor() {
    this.repo = AppDataSource.getRepository(Usuario);
  }

  /** HU-16b – Crear usuario */
  crear(data: {
    nombre: string;
    correo: string;
    password: string;
    dni: string;
  }): Promise<Usuario> {
    const u = this.repo.create(data);
    return this.repo.save(u);
  }

  /** HU-16c – Buscar usuario por correo */
  buscarPorCorreo(correo: string): Promise<Usuario | null> {
    return this.repo.findOneBy({ correo });
  }

  /** Obtener usuario por ID */
  buscarPorId(id: number): Promise<Usuario> {
    return this.repo.findOneByOrFail({ id });
  }

  /** Cambiar contraseña */
  async actualizarPassword(id: number, hashed: string): Promise<void> {
    await this.repo.update(id, { password: hashed });
  }

  /** HU-16a – Listar todos los usuarios (solo admin) */
  async obtenerTodos(): Promise<Omit<Usuario, "password">[]> {
    const list = await this.repo.find();
    return list.map(({ password, ...u }) => u);
  }

  /** HU-16d – Eliminar usuario (solo admin) */
  async eliminar(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  /** HU-16e – Actualizar rol de un usuario (solo admin) */
  async actualizarRol(id: number, rol: "user" | "admin"): Promise<Omit<Usuario, "password">> {
    await this.repo.update(id, { rol });
    const { password, ...u } = await this.repo.findOneByOrFail({ id });
    return u;
  }
}

export const usuarioService = new UsuarioService();

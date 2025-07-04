import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioService {
  private repo = AppDataSource.getRepository(Usuario);

  /** Registra un usuario y devuelve sus propiedades sin el hash */
  async registrar(
    nombre: string,
    correo: string,
    contrasena: string,
    dni: string
  ): Promise<Omit<Usuario, "contrasena">> {
    if (await this.repo.findOneBy({ dni })) {
      throw new Error("El DNI ya está registrado.");
    }
    if (await this.repo.findOneBy({ correo })) {
      throw new Error("El correo ya está registrado.");
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const nuevo = this.repo.create({ nombre, correo, contrasena: hash, dni });
    const saved = await this.repo.save(nuevo);

    const { contrasena: _, ...user } = saved; // elimina el campo
    return user;
  }

  /** Hace login, firma JWT con id y correo, y devuelve token + usuario (sin hash) */
  async login(
    correo: string,
    contrasena: string
  ): Promise<{ token: string; usuario: Omit<Usuario, "contrasena"> }> {
    const usuario = await this.repo.findOneBy({ correo });
    if (!usuario) throw new Error("Usuario no encontrado.");
    if (!(await bcrypt.compare(contrasena, usuario.contrasena))) {
      throw new Error("Contraseña incorrecta.");
    }

    const payload = { id: usuario.id, correo: usuario.correo };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });

    const { contrasena: _, ...user } = usuario;
    return { token, usuario: user };
  }

  /** Recupera contraseña validando correo + DNI; devuelve { ok: true } */
  async recuperarContrasena(
    correo: string,
    dni: string,
    nuevaContrasena: string
  ): Promise<{ ok: true }> {
    const usuario = await this.repo.findOneBy({ correo, dni });
    if (!usuario) throw new Error("Usuario no encontrado con esos datos.");

    usuario.contrasena = await bcrypt.hash(nuevaContrasena, 10);
    await this.repo.save(usuario);
    return { ok: true };
  }

  /** HU-12/HU-13: Actualiza idioma y modo daltónico */
  async actualizarPreferencias(
    userId: number,
    idioma: string,
    modoDaltonico: boolean
  ): Promise<Omit<Usuario, "contrasena">> {
    const usuario = await this.repo.findOneBy({ id: userId });
    if (!usuario) throw new Error("Usuario no encontrado.");

    const idiomasPermitidos = ["es", "qu", "ay"];
    if (!idiomasPermitidos.includes(idioma)) {
      throw new Error("Idioma inválido.");
    }

    usuario.idioma = idioma;
    usuario.modoDaltonico = modoDaltonico;
    const updated = await this.repo.save(usuario);

    const { contrasena: _, ...user } = updated;
    return user;
  }
}

export const usuarioService = new UsuarioService();


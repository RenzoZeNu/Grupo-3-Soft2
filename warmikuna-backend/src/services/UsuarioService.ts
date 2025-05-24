import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioService {
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async registrar(nombre: string, correo: string, contrasena: string, dni: string) {
    const usuarioExistente = await this.usuarioRepo.findOneBy({ correo });
    if (usuarioExistente) throw new Error("El correo ya está registrado.");

    if (!/^\d{8}$/.test(dni)) {
      throw new Error("El DNI debe tener exactamente 8 dígitos numéricos");
    }

    const hash = await bcrypt.hash(contrasena, 10);
    const nuevoUsuario = this.usuarioRepo.create({ nombre, correo, contrasena: hash, dni });
    return await this.usuarioRepo.save(nuevoUsuario);
  }

  async login(correo: string, contrasena: string) {
    const usuario = await this.usuarioRepo.findOneBy({ correo });
    if (!usuario) throw new Error("Usuario no encontrado");

    const passwordValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordValida) throw new Error("Contraseña incorrecta");

    const token = jwt.sign(
      {
        id: usuario.id,
        correo: usuario.correo,
        nombre: usuario.nombre,
        dni: usuario.dni,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return { token, usuario };
  }

  async recuperarContrasena(correo: string, dni: string, nuevaContrasena: string) {
  const usuario = await this.usuarioRepo.findOneBy({ correo, dni });
  if (!usuario) throw new Error("Correo y DNI no coinciden con ningún usuario");

  const nuevaHash = await bcrypt.hash(nuevaContrasena, 10);
  usuario.contrasena = nuevaHash;
  return await this.usuarioRepo.save(usuario);
}

}

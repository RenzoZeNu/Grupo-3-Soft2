import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioService {
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  async registrar(nombre: string, correo: string, contrasena: string, dni: string) {
    // Validar que el DNI no esté registrado
    const dniExistente = await this.usuarioRepository.findOneBy({ dni });
    if (dniExistente) {
      throw new Error("El DNI ya está registrado.");
    }

    // Validar que el correo no esté registrado
    const correoExistente = await this.usuarioRepository.findOneBy({ correo });
    if (correoExistente) {
      throw new Error("El correo ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      dni,
    });

    return this.usuarioRepository.save(nuevoUsuario);
  }

  async login(correo: string, contrasena: string) {
    const usuario = await this.usuarioRepository.findOneBy({ correo });
    if (!usuario) throw new Error("Usuario no encontrado.");

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) throw new Error("Contraseña incorrecta.");

    const token = jwt.sign({ correo: usuario.correo }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { token, usuario };
  }

  async recuperarContrasena(correo: string, dni: string, nuevaContrasena: string) {
    const usuario = await this.usuarioRepository.findOneBy({ correo, dni });
    if (!usuario) throw new Error("Usuario no encontrado con esos datos.");

    const hashed = await bcrypt.hash(nuevaContrasena, 10);
    usuario.contrasena = hashed;

    await this.usuarioRepository.save(usuario);
  }

  async buscarPorDNI(dni: string) {
    return this.usuarioRepository.findOneBy({ dni });
  }

  async buscarPorCorreo(correo: string) {
    return this.usuarioRepository.findOneBy({ correo });
  }
}

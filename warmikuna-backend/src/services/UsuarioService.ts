import { AppDataSource } from "../database/data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioService {
  private usuarioRepository = AppDataSource.getRepository(Usuario);

  /** Registra usuario con preferencias por defecto */
  async registrar(
    nombre: string,
    correo: string,
    contrasena: string,
    dni: string
  ): Promise<Usuario> {
    // Validar DNI único
    const dniExistente = await this.usuarioRepository.findOneBy({ dni });
    if (dniExistente) throw new Error("El DNI ya está registrado.");

    // Validar correo único
    const correoExistente = await this.usuarioRepository.findOneBy({ correo });
    if (correoExistente) throw new Error("El correo ya está registrado.");

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevo = this.usuarioRepository.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      dni,
      idioma: "es",
      modoDaltonico: false,
    });

    return this.usuarioRepository.save(nuevo);
  }

  /** Login y emisión de JWT que incluye preferencias */
  async login(
    correo: string,
    contrasena: string
  ): Promise<{ token: string; usuario: Usuario }> {
    const usuario = await this.usuarioRepository.findOneBy({ correo });
    if (!usuario) throw new Error("Usuario no encontrado.");

    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) throw new Error("Contraseña incorrecta.");

    const payload = {
      id: usuario.id,
      correo: usuario.correo,
      idioma: usuario.idioma,
      modoDaltonico: usuario.modoDaltonico,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return { token, usuario };
  }

  /** Recupera contraseña validando correo + DNI */
  async recuperarContrasena(
    correo: string,
    dni: string,
    nuevaContrasena: string
  ): Promise<void> {
    const usuario = await this.usuarioRepository.findOneBy({ correo, dni });
    if (!usuario) throw new Error("Usuario no encontrado con esos datos.");

    usuario.contrasena = await bcrypt.hash(nuevaContrasena, 10);
    await this.usuarioRepository.save(usuario);
  }

  /** Busca usuario por DNI */
  async buscarPorDNI(dni: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ dni });
  }

  /** Busca usuario por correo */
  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOneBy({ correo });
  }

  /** HU-12 / HU-13: Actualiza idioma y modo daltónico */
  async actualizarPreferencias(
    userId: number,
    idioma: string,
    modoDaltonico: boolean
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id: userId });
    if (!usuario) throw new Error("Usuario no encontrado.");

    const idiomasPermitidos = ["es", "qu", "ay"];
    if (!idiomasPermitidos.includes(idioma)) {
      throw new Error("Idioma inválido.");
    }

    usuario.idioma = idioma;
    usuario.modoDaltonico = modoDaltonico;
    return this.usuarioRepository.save(usuario);
  }
}

export const usuarioService = new UsuarioService();

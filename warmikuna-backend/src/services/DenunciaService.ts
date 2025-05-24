import { AppDataSource } from "../database/data-source";
import { Denuncia } from "../entities/Denuncia";
import { Usuario } from "../entities/Usuario";

export class DenunciaService {
  private denunciaRepo = AppDataSource.getRepository(Denuncia);
  private usuarioRepo = AppDataSource.getRepository(Usuario);

  async crear(usuarioId: number, descripcion: string, anonima: boolean) {
    const usuario = await this.usuarioRepo.findOneBy({ id: usuarioId });
    if (!usuario) throw new Error("Usuario no encontrado");

    const denuncia = this.denunciaRepo.create({ descripcion, anonima, usuario });
    return await this.denunciaRepo.save(denuncia);
  }

  async obtenerPorUsuario(usuarioId: number) {
  return await this.denunciaRepo.find({
    where: { usuario: { id: usuarioId } },
    order: { creadaEn: "DESC" },
  });
}

}

// src/entities/Denuncia.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("denuncias")
export class Denuncia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  descripcion!: string;

  @Column({ type: "boolean", default: true })
  anonima!: boolean;

  @Column({ type: "varchar", length: 50, default: "en revisión" })
  estado!: string;

  @CreateDateColumn({ name: "creada_en" })
  creada_en!: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  evidenciaArchivo!: string | null;

  // ← aquí forzamos VARCHAR(255)
  @Column("varchar", {
    name: "correo_usuario",
    length: 255,
    nullable: true,
  })
  correo_usuario!: string | null;
}



  
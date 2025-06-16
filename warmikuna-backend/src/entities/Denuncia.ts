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

  @Column({ default: true })
  anonima!: boolean;

  @Column({ default: "en revisión" })
  estado!: string;

  @CreateDateColumn({ name: "creada_en" })
  creada_en!: Date;

  @Column({ nullable: true, type: 'varchar' })
  evidenciaArchivo!: string | null;


  @Column()
  correo_usuario!: string;
}

  
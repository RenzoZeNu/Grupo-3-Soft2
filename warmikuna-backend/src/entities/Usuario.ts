import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("usuarios")
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nombre!: string;

  @Column({ length: 100, unique: true })
  correo!: string;

  @Column()
  contrasena!: string;

  @Column({ length: 8, unique: true })
  dni!: string;

  @Column({ name: "es_anonimo", type: "boolean", default: false })
  esAnonimo!: boolean;

  // Preferencias de idioma y modo daltónico
  @Column({ type: "varchar", length: 5, default: "es" })
  idioma!: string;

  @Column({ type: "boolean", default: false })
  modoDaltonico!: boolean;

  @CreateDateColumn({ name: "creado_en" })
  creadoEn!: Date;
}


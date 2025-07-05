// warmikuna-backend/src/entities/Usuario.ts
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

  @Column()
  nombre!: string;

  @Column({ unique: true })
  correo!: string;

  @Column()
  password!: string;

  @Column({ length: 8 })
  dni!: string;

  @Column({ default: "user" })
  rol!: "user" | "admin";

  @CreateDateColumn({ name: "creado_en" })
  creadoEn!: Date;
}





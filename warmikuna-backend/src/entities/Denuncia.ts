import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Usuario } from "./Usuario";
  
  @Entity("denuncias")
  export class Denuncia {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column("text")
    descripcion: string;
  
    @Column({ default: true })
    anonima: boolean;
  
    @Column({ default: "en revisión" })
    estado: string;
  
    @CreateDateColumn({ name: "creada_en" })
    creadaEn: Date;
  
    @ManyToOne(() => Usuario, (usuario) => usuario.id)
    @JoinColumn({ name: "usuario_id" })
    usuario: Usuario;
  }
  
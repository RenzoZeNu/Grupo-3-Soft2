import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
  } from "typeorm";
  import { Denuncia } from "./Denuncia";
  
  @Entity("evidencias")
  export class Evidencia {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    tipo: string; // 'imagen', 'video', 'audio'
  
    @Column()
    url: string;
  
    @CreateDateColumn({ name: "subida_en" })
    subidaEn: Date;
  
    @ManyToOne(() => Denuncia)
    @JoinColumn({ name: "denuncia_id" })
    denuncia: Denuncia;
  }
  
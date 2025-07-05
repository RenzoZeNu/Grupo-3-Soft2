import "reflect-metadata";
 import { DataSource } from "typeorm";
 import { Denuncia } from "../entities/Denuncia";
 import { Evidencia } from "../entities/Evidencia";
 import { Usuario } from "../entities/Usuario";
 
 export const AppDataSource = new DataSource({
   type: "mysql",
   host: process.env.DB_HOST,
   port: Number(process.env.DB_PORT), 
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME,
   entities: [Denuncia, Evidencia, Usuario],
   synchronize: true,
   logging: true,
 });



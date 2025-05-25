import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario";
import { Denuncia } from "../entities/Denuncia";
import { Evidencia } from "../entities/Evidencia";
import dotenv from "dotenv";

dotenv.config();


export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Usuario, Denuncia, Evidencia],
});

// warmikuna-backend/src/database/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Denuncia } from "../entities/Denuncia";
import { Evidencia } from "../entities/Evidencia";
import { Usuario } from "../entities/Usuario";

const isTest = process.env.NODE_ENV === "test";

const sqliteOptions = {
  type: "sqlite" as const,
  database: ":memory:",
  entities: [Denuncia, Evidencia, Usuario],
  synchronize: true,
  dropSchema: true,
  logging: false
};

const mysqlOptions = {
  type: "mysql" as const,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Denuncia, Evidencia, Usuario],
  synchronize: true,
  logging: true
};

export const AppDataSource = new DataSource(
  isTest ? sqliteOptions : mysqlOptions
);


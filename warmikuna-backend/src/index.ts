import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { AppDataSource } from "./database/data-source";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Base de datos conectada");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Error conectando a la base de datos:", err);
    process.exit(1);
  });



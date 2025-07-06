import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { AppDataSource } from "./database/data-source";

// 1) Exportamos el express app para los tests
export default app;

// 2) Solo inicializamos DB y arrancamos el listener si se ejecuta este fichero directamente
if (require.main === module) {
  AppDataSource.initialize()
    .then(() => {
      console.log("✅ Base de datos conectada");
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () =>
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      );
    })
    .catch((err) => {
      console.error("❌ Error conectando a la base de datos:", err);
      process.exit(1);
    });
}

import "reflect-metadata";
import dotenv from "dotenv";
import { AppDataSource } from "./database/data-source";
import app from "./app";

dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conexión exitosa a MySQL");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Error en la conexión:", error));

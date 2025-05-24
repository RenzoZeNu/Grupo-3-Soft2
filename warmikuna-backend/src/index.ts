import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./database/data-source";
import usuarioRoutes from "./routes/usuario.routes";
import denunciaRoutes from "./routes/denuncia.routes";
import evidenciaRoutes from "./routes/evidencia.routes";
import cors from 'cors';


dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://localhost:4200', 
  credentials: true
}));

app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/denuncias", denunciaRoutes);
app.use("/api/evidencias", evidenciaRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenido a WARMIKUNA API");
});

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Conexión exitosa a MySQL");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Error en la conexión:", error));

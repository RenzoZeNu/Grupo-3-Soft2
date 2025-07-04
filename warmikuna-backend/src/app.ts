import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";

import usuarioRoutes from "./routes/usuario.routes";
import denunciaRoutes from "./routes/denuncia.routes";
import evidenciaRoutes from "./routes/evidencia.routes";

const app = express();

// 1) Middleware CORS (ajusta el origin a tu frontend Angular)
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  })
);

// 2) Parser JSON
app.use(express.json());

// 3) Rutas de tu API
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/denuncias", denunciaRoutes);
app.use("/api/evidencias", evidenciaRoutes);

// 4) Servir archivos estáticos (uploads)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// 5) Ruta raíz de prueba
app.get("/", (_req, res) => {
  res.send("Bienvenido a WARMIKUNA API");
});

export default app;

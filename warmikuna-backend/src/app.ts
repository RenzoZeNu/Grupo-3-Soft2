import "reflect-metadata";
import express from "express";
import usuarioRoutes from "./routes/usuario.routes";
import denunciaRoutes from "./routes/denuncia.routes";
import evidenciaRoutes from "./routes/evidencia.routes";
import cors from 'cors';
import path from "path";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/denuncias", denunciaRoutes);
app.use("/api/evidencias", evidenciaRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) => {
  res.send("Bienvenido a WARMIKUNA API");
});

export default app;

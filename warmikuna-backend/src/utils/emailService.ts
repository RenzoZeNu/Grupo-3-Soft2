import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
  throw new Error("EMAIL_USER y EMAIL_PASS deben estar definidos en .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user, pass },
});
transporter.verify().then(() => {
  console.log("✅ Conexión SMTP verificada correctamente");
}).catch(err => {
  console.error("❌ No se pudo conectar al SMTP:", err);
});

export const enviarCorreo = async (
  destinatario: string,
  asunto: string,
  mensajeHtml: string
): Promise<void> => {
  const mailOptions = {
    from: `"Warmikuna" <${user}>`,
    to: destinatario,
    subject: asunto,
    html: mensajeHtml,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error("Error en enviarCorreo:", error);
  }
};


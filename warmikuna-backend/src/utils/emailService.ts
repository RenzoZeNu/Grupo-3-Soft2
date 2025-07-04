import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarCorreo = async (
  destinatario: string,
  asunto: string,
  mensajeHtml: string
): Promise<void> => {
  const mailOptions = {
    from: `"Warmikuna" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: asunto,
    html: mensajeHtml
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a: ${destinatario}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

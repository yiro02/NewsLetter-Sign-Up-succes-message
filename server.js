const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configurar transporter de nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false, // usa STARTTLS en lugar de SSL directo
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error al verificar el transportador SMTP:', error);
  } else {
    console.log('Transportador SMTP listo para enviar emails');
  }
});

// Endpoint para enviar email de bienvenida
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Email inválido' });
    }

    // Opciones del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '¡Bienvenido a nuestro Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="background-color: white; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">¡Bienvenido a nuestro Newsletter!</h2>
            <p style="color: #555; line-height: 1.6;">
              Hola ${email},
            </p>
            <p style="color: #555; line-height: 1.6;">
              Gracias por suscribirte. 🎉
            </p>
            <p style="color: #555; line-height: 1.6;">
              Recibirás actualizaciones mensuales sobre:
            </p>
            <ul style="color: #555; line-height: 1.8;">
              <li>Descubrimiento de productos</li>
              <li>Mejora de lo que importa</li>
              <li>Medición del éxito de tus actualizaciones</li>
              <li>¡Y mucho más!</li>
            </ul>
            <p style="color: #555; line-height: 1.6;">
              Estamos emocionados de tenerte en nuestra comunidad.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Si no te suscribiste a este newsletter, puedes ignorar este email.
            </p>
          </div>
        </div>
      `
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Email enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

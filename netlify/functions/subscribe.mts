import type { Config, Context } from '@netlify/functions'
import nodemailer from 'nodemailer'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const welcomeEmailHtml = (email: string) => `
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

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { email } = await req.json().catch(() => ({ email: undefined }))

  if (typeof email !== 'string' || !emailRegex.test(email)) {
    return Response.json({ success: false, message: 'Email inválido' }, { status: 400 })
  }

  const emailUser = Netlify.env.get('EMAIL_USER') || Netlify.env.get('SMTP_EMAIL')
  const emailPass = Netlify.env.get('EMAIL_PASS') || Netlify.env.get('SMTP_PASSWORD')
  const smtpHost = Netlify.env.get('SMTP_HOST') || 'smtp.gmail.com'
  const smtpPort = Number(Netlify.env.get('SMTP_PORT') || 587)

  if (!emailUser || !emailPass) {
    return Response.json(
      {
        success: false,
        message: 'Email credentials are missing. Set EMAIL_USER and EMAIL_PASS as environment variables on the site.',
      },
      { status: 500 },
    )
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort !== 465,
    auth: { user: emailUser, pass: emailPass },
  })

  try {
    await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: '¡Bienvenido a nuestro Newsletter!',
      html: welcomeEmailHtml(email),
    })

    return Response.json({ success: true, message: 'Email enviado correctamente' })
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: 'Error al enviar el email',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export const config: Config = {
  path: '/api/subscribe',
  method: 'POST',
}

import sgMail from '../config/sendgrid.js'

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!sgMail) {
    throw new Error('SendGrid not configured')
  }
  const from = process.env.SENDGRID_FROM_EMAIL
  if (!from) {
    throw new Error('SENDGRID_FROM_EMAIL not set')
  }
  try {
    await sgMail.send({ to, from, subject, html, text })
  } catch (error) {
    console.error('SendGrid Error:', error)
    throw new Error(`Email sending failed: ${error.message}`)
  }
}

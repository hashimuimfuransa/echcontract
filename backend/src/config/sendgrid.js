import sgMail from '@sendgrid/mail'

// Set API key immediately when module is imported
const { SENDGRID_API_KEY } = process.env

console.log('SENDGRID_API_KEY loaded:', SENDGRID_API_KEY ? `${SENDGRID_API_KEY.substring(0, 10)}...` : 'NOT SET')

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
  console.log('SendGrid API key set successfully')
} else {
  console.error('ERROR: SENDGRID_API_KEY not found in environment variables')
}

export default sgMail

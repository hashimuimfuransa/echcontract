import sgMail from '@sendgrid/mail'

// Initialize API key on first use (lazy loading)
let initialized = false

function ensureApiKeySet() {
  if (!initialized) {
    const { SENDGRID_API_KEY } = process.env
    
    console.log('SENDGRID_API_KEY loaded:', SENDGRID_API_KEY ? `${SENDGRID_API_KEY.substring(0, 10)}...` : 'NOT SET')
    
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY)
      console.log('SendGrid API key set successfully')
    } else {
      console.error('ERROR: SENDGRID_API_KEY not found in environment variables')
    }
    initialized = true
  }
}

// Wrap sgMail to ensure key is set before using
const sgMailProxy = new Proxy(sgMail, {
  get(target, prop) {
    ensureApiKeySet()
    return target[prop]
  }
})

export default sgMailProxy

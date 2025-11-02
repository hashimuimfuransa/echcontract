import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

import express from 'express'
import cors from 'cors'
import router from './routes/index.js'

console.log('Loaded env vars:', { CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? '***' : undefined, CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '***' : undefined })
import { connectDatabase } from './config/db.js'

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.use((err, req, res, next) => {
  console.error('ERROR:', err)
  console.error('Error message:', err.message)
  console.error('Error stack:', err.stack)
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal server error' })
})

const PORT = process.env.PORT || 4000

const start = async () => {
  try {
    await connectDatabase()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to connect to database', error)
    process.exit(1)
  }
}

start()

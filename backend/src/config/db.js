import mongoose from 'mongoose'

export const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI not set')
  }
  await mongoose.connect(uri)
}

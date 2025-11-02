import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false })

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  position: { type: String },
  role: { type: String, enum: ['employee', 'admin'], default: 'employee' },
  documents: { type: [documentSchema], default: [] },
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpiresAt: { type: Date },
  status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Employee', employeeSchema)

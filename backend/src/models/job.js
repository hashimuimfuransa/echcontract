import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, required: true },
  subcategories: [{ type: String }],
  requirements: [{ type: String }],
  qualifications: [{ type: String }],
  responsibilities: [{ type: String }],
  requiredDocuments: [{ type: String }],
  baseSalaryMin: { type: Number },
  baseSalaryMax: { type: Number },
  salaryPaymentFrequency: { type: String, enum: ['Per Course', 'Per Month', 'Per Week', 'Per Lesson', 'Others'], default: 'Per Month' },
  benefits: [{ type: String }],
  contractType: { type: String, enum: ['Indefinite', 'Fixed Term', 'Temporary'], default: 'Indefinite' },
  contractDurationMonths: { type: Number },
  workingHoursPerWeek: { type: Number, default: 40 },
  remoteWorkPolicy: { type: String, default: 'Flexible' },
  location: { type: String, required: true },
  startDate: { type: Date },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model('Job', jobSchema)
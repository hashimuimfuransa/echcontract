import mongoose from 'mongoose'

const contractSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  formData: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['Draft', 'Under Review', 'Approved', 'Rejected'], default: 'Draft' },
  pdfUrl: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  approvedAt: { type: Date },
  comments: { type: String },
  history: {
    type: [
      {
        status: { type: String, required: true },
        changedBy: { type: String },
        changedAt: { type: Date, default: Date.now },
        note: { type: String }
      }
    ],
    default: []
  }
}, { timestamps: true })

export default mongoose.model('Contract', contractSchema)

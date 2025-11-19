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
  baseSalaryMin: { type: String }, // Changed from Number to String
  baseSalaryMax: { type: String }, // Changed from Number to String
  salaryPaymentFrequency: { type: String, enum: ['Per Course', 'Per Month', 'Per Week', 'Per Lesson', 'Others'], default: 'Per Month' },
  amountPerSession: { type: String }, // Changed from Number to String
  modeOfPayment: { type: String },
  paymentTerms: { type: String },
  rateAdjustment: { type: String },
  benefits: [{ type: String }],
  contractType: { type: String, enum: ['Indefinite', 'Fixed Term', 'Temporary'], default: 'Indefinite' },
  contractDurationMonths: { type: Number },
  workingHoursPerWeek: { type: Number, default: 40 },
  workingHoursStart: { type: String },
  workingHoursEnd: { type: String },
  workingHoursByDay: {
    type: Map,
    of: {
      start: String,
      end: String,
      payment: { type: String, default: '' }
    },
    default: {}
  },
  remoteWorkPolicy: { type: String, default: 'Flexible' },
  relocationConditions: { type: String },
  terminationConditions: { type: String },
  employeeNoticePeriod: { type: String },
  employerNoticePeriod: { type: String },
  groundsForDismissal: { type: String },
  severancePay: { type: String },
  disputeResolution: { type: String },
  jurisdiction: { type: String },
  annualLeaveDays: { type: Number, default: 20 },
  overtimePolicy: { type: String },
  sickLeavePolicy: { type: String },
  unpaidLeaveConditions: { type: String },
  confidentialityAgreement: { type: String },
  intellectualPropertyClause: { type: String },
  nonCompeteClause: { type: String },
  nonSolicitationClause: { type: String },
  location: { type: String, required: true },
  startDate: { type: Date },
  status: { type: String, enum: ['Active', 'Closed', 'Draft'], default: 'Draft' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

// Pre-save middleware to ensure working hours by day structure
jobSchema.pre('save', function(next) {
  // Ensure workingHoursByDay has proper structure
  if (this.workingHoursByDay) {
    const workingHours = this.workingHoursByDay;
    for (const [day, hours] of workingHours.entries()) {
      if (typeof hours === 'object') {
        // Ensure all required properties exist
        workingHours.set(day, {
          start: hours.start || '',
          end: hours.end || '',
          payment: hours.payment || ''
        });
      }
    }
  }
  next();
});

export default mongoose.model('Job', jobSchema)
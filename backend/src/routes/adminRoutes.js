import { Router } from 'express'
import { body, param } from 'express-validator'
import { authenticate } from '../middleware/authMiddleware.js'
import {
  getDashboardMetrics,
  listEmployees,
  listContracts,
  reviewContract,
  updateEmployeeStatus,
  getContractDetails,
  editContract,
  approveContract,
  rejectContract
} from '../controllers/adminController.js'
import {
  createJob,
  updateJob,
  getJobById,
  listAllJobs,
  deleteJob,
  getJobStats
} from '../controllers/jobController.js'

const router = Router()

router.use(authenticate(['admin']))

router.get('/dashboard/metrics', getDashboardMetrics)

router.get('/employees', listEmployees)

router.get('/contracts', listContracts)

router.get('/contracts/:contractId', param('contractId').isMongoId(), getContractDetails)

router.put('/contracts/:contractId', [
  param('contractId').isMongoId(),
  body('formData').isObject(),
  body('notes').optional().isString()
], editContract)

router.post('/contracts/:contractId/review', [
  param('contractId').isMongoId(),
  body('status').isIn(['Approved', 'Rejected']),
  body('notes').optional().isString()
], reviewContract)

router.post('/contracts/:contractId/approve', [
  param('contractId').isMongoId(),
  body('notes').optional().isString()
], approveContract)

router.post('/contracts/:contractId/reject', [
  param('contractId').isMongoId(),
  body('reason').isString()
], rejectContract)

router.patch('/employees/:employeeId/status', [
  param('employeeId').isMongoId(),
  body('status').isIn(['active', 'inactive', 'terminated'])
], updateEmployeeStatus)

// Job Management Routes
router.post('/jobs', [
  body('title').notEmpty().isString(),
  body('description').notEmpty().isString(),
  body('department').notEmpty().isString(),
  body('category').notEmpty().isString(),
  body('subcategories').optional().isArray(),
  body('location').notEmpty().isString(),
  body('amountPerSession').optional().isNumeric(),
  body('modeOfPayment').optional().isString(),
  body('paymentTerms').optional().isString(),
  body('rateAdjustment').optional().isString()
], createJob)

router.get('/jobs/stats', getJobStats)

router.get('/jobs', listAllJobs)

router.get('/jobs/:jobId', param('jobId').isMongoId(), getJobById)

router.put('/jobs/:jobId', [
  param('jobId').isMongoId(),
  body('subcategories').optional().isArray(),
  body('amountPerSession').optional().isNumeric(),
  body('modeOfPayment').optional().isString(),
  body('paymentTerms').optional().isString(),
  body('rateAdjustment').optional().isString()
], updateJob)

router.delete('/jobs/:jobId', param('jobId').isMongoId(), deleteJob)

export default router

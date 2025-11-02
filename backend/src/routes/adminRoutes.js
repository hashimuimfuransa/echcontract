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

export default router

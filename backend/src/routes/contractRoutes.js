import { Router } from 'express'
import { body } from 'express-validator'
import { authenticate } from '../middleware/authMiddleware.js'
import { upload } from '../middleware/upload.js'
import {
  getMyContract,
  submitContract,
  uploadDocuments,
  downloadContractPdf
} from '../controllers/contractController.js'

const router = Router()

const contractValidation = [
  body('formData').isObject()
]

router.get('/me', authenticate(['employee']), getMyContract)
router.post('/', authenticate(['employee']), contractValidation, submitContract)
router.post('/documents', authenticate(['employee']), upload.array('files', 5), uploadDocuments)
router.get('/:contractId/pdf', authenticate(['employee', 'admin']), downloadContractPdf)

export default router

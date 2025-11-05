import { Router } from 'express'
import { param } from 'express-validator'
import { authenticate } from '../middleware/authMiddleware.js'
import {
  listActiveJobs,
  getJobById
} from '../controllers/jobController.js'

const router = Router()

// Public routes - anyone can view active jobs
router.get('/', listActiveJobs)
router.get('/:jobId', param('jobId').isMongoId(), getJobById)

export default router
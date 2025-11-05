import { Router } from 'express'
import authRoutes from './authRoutes.js'
import contractRoutes from './contractRoutes.js'
import adminRoutes from './adminRoutes.js'
import jobRoutes from './jobRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/contracts', contractRoutes)
router.use('/admin', adminRoutes)
router.use('/jobs', jobRoutes)

export default router

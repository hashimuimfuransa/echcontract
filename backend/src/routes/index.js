import { Router } from 'express'
import authRoutes from './authRoutes.js'
import contractRoutes from './contractRoutes.js'
import adminRoutes from './adminRoutes.js'

const router = Router()

router.use('/auth', authRoutes)
router.use('/contracts', contractRoutes)
router.use('/admin', adminRoutes)

export default router

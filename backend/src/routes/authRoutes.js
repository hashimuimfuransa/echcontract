import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, verifyEmail } from '../controllers/authController.js'

const router = Router()

const registerValidation = [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('position').optional().isString()
]

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
]

router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)
router.get('/verify/:token', verifyEmail)

export default router

import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import Employee from '../models/employee.js'
import { sendEmail } from '../utils/sendEmail.js'
import { verificationEmailTemplate } from '../utils/emailTemplates.js'

const buildToken = (employee) => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET not set')
  }
  return jwt.sign({ id: employee.id, role: employee.role, name: employee.name }, secret, { expiresIn: '7d' })
}

const buildVerificationLink = (token) => {
  const base = process.env.FRONTEND_URL || process.env.APP_URL || process.env.APP_BASE_URL
  if (base) {
    return `${base.replace(/\/$/, '')}/verify/${token}`
  }
  return `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/verify/${token}`
}

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password, position } = req.body
    const existing = await Employee.findOne({ email })
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' })
    }
    const hash = await bcrypt.hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const employee = await Employee.create({
      name,
      email,
      password: hash,
      position,
      verificationToken,
      verificationExpiresAt
    })
    const link = buildVerificationLink(verificationToken)
    await sendEmail({
      to: email,
      subject: 'Verify your Excellence Coaching Hub account',
      html: verificationEmailTemplate(name, link),
      text: `Welcome ${name}, please verify your account: ${link}`
    })
    res.status(201).json({ message: 'Registration successful. Please verify your email.' })
  } catch (error) {
    console.error('Registration error:', error.message)
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params
    const employee = await Employee.findOne({ verificationToken: token, verificationExpiresAt: { $gt: new Date() } })
    if (!employee) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }
    employee.verified = true
    employee.verificationToken = undefined
    employee.verificationExpiresAt = undefined
    await employee.save()
    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    const employee = await Employee.findOne({ email })
    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const valid = await bcrypt.compare(password, employee.password)
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    if (!employee.verified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' })
    }
    if (employee.status !== 'active') {
      return res.status(403).json({ message: 'Account inactive. Contact administrator.' })
    }
    const token = buildToken(employee)
    res.json({
      token,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        position: employee.position
      }
    })
  } catch (error) {
    next(error)
  }
}

import jwt from 'jsonwebtoken'

export const authenticate = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.replace('Bearer ', '') : null
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (roles.length && !roles.includes(payload.role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

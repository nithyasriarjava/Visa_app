import jwt from 'jsonwebtoken'
import { findUserById } from '../data/storage.js'

export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = findUserById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user
    req.user = userWithoutPassword
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
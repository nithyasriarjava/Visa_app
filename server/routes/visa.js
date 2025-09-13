import express from 'express'
import { saveApplication, findApplicationByUserId } from '../data/storage.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Submit visa application
router.post('/apply', authenticate, async (req, res) => {
  try {
    const { personalDetails, addressDetails, h1bDetails } = req.body

    const application = saveApplication({
      userId: req.user._id,
      personalDetails,
      addressDetails,
      h1bDetails,
      status: 'pending'
    })

    res.json({ message: 'Application submitted successfully', application })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's visa profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const application = findApplicationByUserId(req.user._id)
    
    if (!application) {
      return res.json(null)
    }

    res.json(application)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
import express from 'express'
import { getApplications, findUserById } from '../data/storage.js'
import { authenticate, requireAdmin } from '../middleware/auth.js'
import { sendEmailNotification, sendCallNotification } from '../services/notifications.js'

const router = express.Router()

// Get all applicants (admin only)
router.get('/applicants', authenticate, requireAdmin, async (req, res) => {
  try {
    const applications = getApplications()
    
    // Add user details to each application
    const applicationsWithUsers = applications.map(app => {
      const user = findUserById(app.userId)
      return {
        ...app,
        userId: user
      }
    })

    res.json(applicationsWithUsers)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Send reminder to user
router.post('/send-reminder', authenticate, requireAdmin, async (req, res) => {
  try {
    const { userId, type } = req.body

    const applications = getApplications()
    const application = applications.find(app => app.userId === userId)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    const user = findUserById(userId)
    const daysRemaining = Math.ceil((new Date(application.h1bDetails.endDate) - new Date()) / (1000 * 60 * 60 * 24))

    if (type === 'email') {
      await sendEmailNotification(user.email, {
        name: `${user.firstName} ${user.lastName}`,
        daysRemaining,
        expiryDate: application.h1bDetails.endDate
      })
    } else if (type === 'call') {
      await sendCallNotification(application.personalDetails.phone, {
        name: `${user.firstName} ${user.lastName}`,
        daysRemaining
      })
    }

    res.json({ message: `${type} reminder sent successfully` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error sending reminder' })
  }
})

export default router
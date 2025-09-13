import cron from 'node-cron'
import { getApplications, findUserById } from '../data/storage.js'
import { sendEmailNotification, sendCallNotification } from './notifications.js'

// Check for visa expiries daily at 9 AM
export const startExpiryCheckJob = () => {
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily visa expiry check...')
    
    try {
      const today = new Date()
      const applications = getApplications()

      for (const application of applications) {
        if (!application.h1bDetails?.endDate) continue

        const daysRemaining = Math.ceil((new Date(application.h1bDetails.endDate) - today) / (1000 * 60 * 60 * 24))
        
        if (daysRemaining <= 10 && daysRemaining > 0) {
          const user = findUserById(application.userId)
          
          // Send email for 10 days or less
          await sendEmailNotification(user.email, {
            name: `${user.firstName} ${user.lastName}`,
            daysRemaining,
            expiryDate: application.h1bDetails.endDate
          })

          // Send call for 2 days or less
          if (daysRemaining <= 2) {
            await sendCallNotification(application.personalDetails.phone, {
              name: `${user.firstName} ${user.lastName}`,
              daysRemaining
            })
          }
        }
      }

      console.log(`Processed ${applications.length} applications for expiry check`)
    } catch (error) {
      console.error('Error in expiry check job:', error)
    }
  })

  console.log('Visa expiry check job scheduled')
}
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/auth.js'
import visaRoutes from './routes/visa.js'
import adminRoutes from './routes/admin.js'

// Import services
import { startExpiryCheckJob } from './services/cronJobs.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/visa', visaRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() })
})

// Start cron jobs
startExpiryCheckJob()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log('Using local file storage')
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

export default app
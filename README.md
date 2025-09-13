# Visa Application Management System

A comprehensive web application for managing H1B visa applications with automated expiry tracking and notifications.

## Features

### 🔐 Authentication
- JWT-based user authentication
- Role-based access (User/Admin)
- Secure password hashing

### 👤 User Dashboard
- **Profile Management**: View personal, address, and H1B details
- **Visa Application**: Multi-step form for complete application
- **Expiry Tracking**: Real-time countdown of visa expiry days

### 🛡️ Admin Dashboard
- View all applicants and their details
- Filter by expiry status (30 days, 10 days, critical)
- Send email/call reminders to users
- Statistics overview

### 📧 Automated Notifications
- **Email Alerts**: Sent when visa expires in ≤10 days
- **Call Reminders**: Sent when visa expires in ≤2 days
- **Daily Cron Job**: Automatic expiry checking

### 🎨 Modern UI
- Built with shadcn/ui components
- Tailwind CSS styling
- Responsive design
- Professional interface

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **NodeMailer** - Email service
- **Node-cron** - Scheduled tasks

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Setup

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visa-management
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Database Setup

Start MongoDB locally or use MongoDB Atlas:
```bash
# For local MongoDB
mongod
```

### 4. Run the Application

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend
npm run dev
```

### 5. Create Admin User

Register a new user, then manually update the database:
```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Application Flow

### User Journey
1. **Register/Login** - Create account or sign in
2. **Complete Profile** - Fill personal, address, and H1B details
3. **Track Expiry** - Monitor visa expiry countdown
4. **Receive Alerts** - Get email/call notifications

### Admin Journey
1. **Login as Admin** - Access admin dashboard
2. **View Applicants** - See all users and their status
3. **Filter by Expiry** - Find users with expiring visas
4. **Send Reminders** - Manual email/call notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Visa Management
- `POST /api/visa/apply` - Submit/update application
- `GET /api/visa/profile` - Get user's visa data

### Admin
- `GET /api/admin/applicants` - Get all applicants
- `POST /api/admin/send-reminder` - Send notifications

## Key Features Explained

### Visa Expiry Calculation
```javascript
const calculateDaysRemaining = (endDate) => {
  const today = new Date()
  const end = new Date(endDate)
  const diffTime = end - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}
```

### Automated Notifications
- **Daily Cron Job**: Runs at 9 AM to check expiries
- **Email Threshold**: ≤10 days remaining
- **Call Threshold**: ≤2 days remaining

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist folder
```

### Backend (Railway/Heroku)
```bash
# Set environment variables
# Deploy server folder
```

### Database (MongoDB Atlas)
- Create cluster
- Update MONGODB_URI in .env

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details
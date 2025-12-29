// App Configuration
export const APP_CONFIG = {
  name: 'VisaFlow',
  tagline: 'Your Gateway to Global Travel',
  description: 'Streamline your visa applications with our intelligent platform. Fast, secure, and reliable visa processing.',
  redirectUrl: 'https://nithyasriarjava.github.io/Visa_app/',
  resetPasswordPath: '/#/reset-password'
}

// UI Messages
export const MESSAGES = {
  loading: {
    dashboard: 'Loading Dashboard...',
    customerDetails: 'Loading Customer Details...',
    adminDashboard: 'Loading admin dashboard...'
  },
  success: {
    login: 'Login successful!',
    registration: 'Check email & verify',
    passwordReset: 'Password reset email sent!',
    customerDeleted: 'Customer deleted successfully!',
    customerUpdated: 'Customer updated successfully! Redirecting to dashboard...',
    applicationSubmitted: 'Visa application submitted successfully!'
  },
  error: {
    loginFailed: 'Login failed',
    registrationFailed: 'Registration failed',
    noAccount: 'No account found. Please signup.',
    verifyEmail: 'Verify email before login',
    incorrectPassword: 'Incorrect password',
    accountExists: 'Account exists, please login',
    googleAuthFailed: 'Google authentication failed',
    passwordReset: 'Failed to send reset email',
    customerNotFound: 'Customer not found',
    deleteError: 'Error deleting customer. Please try again.',
    applicationError: 'Error submitting application.',
    notAuthenticated: 'User not authenticated. Please login again.'
  }
}

// Form Validation
export const VALIDATION = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[1-9]\d{7,14}$/,
  letters: /^[a-zA-Z\s]+$/,
  lettersExtended: /^[a-zA-Z\s&.,'-]+$/,
  numbers: /^\d+$/,
  usZip: /^\d{5}(-\d{4})?$/,
  indianPin: /^\d{6}$/,
  minPasswordLength: 6
}

// US States and Indian States
export const STATES = [
  // US States
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia', 
  'Puerto Rico', 'US Virgin Islands', 'American Samoa', 'Guam', 'Northern Mariana Islands',
  // Indian States
  'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Kerala', 'Maharashtra', 'Gujarat', 'Rajasthan', 
  'West Bengal', 'Uttar Pradesh', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Telangana', 'Assam', 
  'Jharkhand', 'Haryana', 'Punjab', 'Chhattisgarh', 'Himachal Pradesh', 'Uttarakhand', 'Goa', 
  'Tripura', 'Meghalaya', 'Manipur', 'Nagaland', 'Arunachal Pradesh', 'Mizoram', 'Sikkim', 
  'Delhi', 'Puducherry', 'Chandigarh', 'Andaman and Nicobar Islands', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Ladakh', 'Jammu and Kashmir'
]

// Features for branding pages
export const FEATURES = {
  login: [
    'AI-powered application assistance',
    'Real-time status tracking',
    'Expert consultation available',
    'Secure document management'
  ],
  register: [
    {
      title: 'Lightning Fast',
      description: 'Process applications in record time'
    },
    {
      title: 'Bank-Level Security',
      description: 'Your documents are protected with enterprise-grade encryption'
    },
    {
      title: 'Global Coverage',
      description: 'Support for 150+ countries and territories'
    }
  ]
}

// Form Options
export const FORM_OPTIONS = {
  sex: ['Male', 'Female', 'Other'],
  maritalStatus: ['Single', 'Married', 'Divorced']
}

// Admin Dashboard Filters
export const ADMIN_FILTERS = [
  { key: 'all', label: 'All Applicants' },
  { key: 'expiring30', label: 'Expiring in 30 days' },
  { key: 'expiring10', label: 'Expiring in 10 days' },
  { key: 'critical', label: 'Critical (≤2 days)' }
]

// Time Constants
export const TIME_CONSTANTS = {
  redirectDelay: 2000,
  messageTimeout: 3000,
  criticalDays: 2,
  warningDays: 10,
  expiringDays: 30
}
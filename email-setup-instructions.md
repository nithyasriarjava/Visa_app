# Email Setup Instructions

To send real emails, you need to set up EmailJS:

## Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email

## Step 2: Create Email Service
1. Go to Email Services
2. Add Gmail service
3. Connect your Gmail account
4. Note the Service ID

## Step 3: Create Email Template
1. Go to Email Templates
2. Create new template with ID: `template_visa_alert`
3. Use these variables in template:
   - {{to_name}} - Recipient name
   - {{days_remaining}} - Days until expiry
   - {{alert_type}} - Type of alert
   - {{message}} - Full message

## Step 4: Get User ID
1. Go to Account settings
2. Copy your User ID

## Step 5: Update Code
Replace in Profile.jsx:
- `service_id: 'your_service_id'`
- `user_id: 'your_emailjs_user_id'`

## Alternative: Simple Email API
For testing, you can use a simple email API like:
- Formspree
- EmailJS
- SendGrid
- Mailgun

The current code will simulate emails if real sending fails.
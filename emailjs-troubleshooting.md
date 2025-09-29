# EmailJS Troubleshooting Guide

Your EmailJS shows "success" but emails aren't being delivered. Here's how to fix it:

## 1. Check Your EmailJS Dashboard
- Go to https://dashboard.emailjs.com/admin
- Verify your service is connected to Gmail
- Check if your template exists and has the right variables

## 2. Verify Template Variables
Your template MUST have these exact variables:
- {{to_email}}
- {{to_name}}
- {{days_remaining}}
- {{alert_type}}
- {{message}}

## 3. Check Gmail Settings
- Make sure your Gmail account allows "Less secure app access"
- Or use App Passwords if you have 2FA enabled

## 4. Test Your EmailJS Setup
Go to EmailJS dashboard → Test tab and send a test email

## 5. Current Configuration
- Service ID: service_lxn4iei
- Template ID: template_qaxmqnn
- Public Key: LEBiZ-gpuLn6UvJ5y

## 6. Common Issues
- Template variables don't match
- Gmail account not properly connected
- Service not active
- Template not published

## 7. Alternative Solution
If EmailJS keeps failing, we can switch to a different email service like:
- Formspree
- SendGrid
- Mailgun
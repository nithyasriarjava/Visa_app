# Install EmailJS Package

Run this command in your project terminal:

```bash
npm install @emailjs/browser
```

Then update your EmailJS settings:

1. Go to your EmailJS dashboard
2. Copy your Public Key from Account settings
3. Replace 'YOUR_PUBLIC_KEY' in Profile.jsx with your actual public key
4. Make sure your template has these variables:
   - {{to_email}}
   - {{to_name}} 
   - {{days_remaining}}
   - {{alert_type}}
   - {{message}}

Your service ID and template ID are already correct in the code.
import nodemailer from 'nodemailer'

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export const sendEmailNotification = async (email, data) => {
  try {
    const { name, daysRemaining, expiryDate } = data
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Visa Expiry Alert - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Visa Expiry Alert</h2>
          <p>Dear ${name},</p>
          <p>This is an important reminder that your H1B visa is expiring soon.</p>
          <div style="background-color: #fee2e2; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <strong>Days Remaining: ${daysRemaining}</strong><br>
            <strong>Expiry Date: ${new Date(expiryDate).toLocaleDateString()}</strong>
          </div>
          <p>Please take immediate action to renew your visa or contact your immigration attorney.</p>
          <p>Best regards,<br>Visa Management Team</p>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${email}`)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export const sendCallNotification = async (phoneNumber, data) => {
  try {
    const { name, daysRemaining } = data
    
    // Simulate Twilio call - In production, use actual Twilio SDK
    console.log(`SIMULATED CALL to ${phoneNumber}:`)
    console.log(`"Hello ${name}, this is an urgent reminder that your H1B visa expires in ${daysRemaining} days. Please contact your immigration attorney immediately."`)
    
    // Actual Twilio implementation would be:
    /*
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    
    await twilio.calls.create({
      twiml: `<Response><Say>Hello ${name}, this is an urgent reminder that your H1B visa expires in ${daysRemaining} days. Please contact your immigration attorney immediately.</Say></Response>`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    })
    */
    
    return { success: true, message: 'Call notification sent' }
  } catch (error) {
    console.error('Error sending call notification:', error)
    throw error
  }
}
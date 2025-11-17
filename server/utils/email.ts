import sgMail from '@sendgrid/mail'

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  const config = useRuntimeConfig()

  // Set SendGrid API key
  sgMail.setApiKey(config.sendgridApiKey)

  // Email content
  const msg = {
    to: toEmail,
    from: config.sendgridFromEmail || 'noreply@chatapp.com', // Use verified sender email
    subject: 'Your OTP Code - Chat App',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; text-align: center;">🔐 Chat App</h1>
        </div>
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Two-Step Verification</h2>
          <p style="color: #4b5563; font-size: 16px;">Your OTP code is:</p>
          <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 25px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1f2937; border-radius: 8px; margin: 20px 0;">
            ${otpCode}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            ⏱️ This code will expire in <strong>5 minutes</strong>.
          </p>
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this code, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © 2025 Chat App. All rights reserved.
          </p>
        </div>
      </div>
    `,
  }

  // Send email via SendGrid
  await sgMail.send(msg)
}

import sgMail from '@sendgrid/mail'

export async function sendOtpEmail(toEmail: string, otpCode: string) {
  const config = useRuntimeConfig()

  // Set SendGrid API key
  sgMail.setApiKey(config.sendgridApiKey)

  // Email content
  const msg = {
    to: toEmail,
    from: {
      email: config.sendgridFromEmail || 'noreply@chatapp.com',
      name: 'Chat App Security',
    },
    replyTo: config.sendgridFromEmail,
    subject: 'Your One-Time Password (OTP) - Chat App',
    text: `Your OTP code is: ${otpCode}. This code will expire in 5 minutes. If you didn't request this code, please ignore this email.`,
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
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              <strong>Security Tip:</strong> Never share this code with anyone. Chat App staff will never ask for your OTP code.
            </p>
          </div>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 5px 0;">
            © 2025 Chat App. All rights reserved.
          </p>
          <p style="color: #9ca3af; font-size: 11px; text-align: center; margin: 5px 0;">
            This is an automated security message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  }

  // Send email via SendGrid
  await sgMail.send(msg)
}

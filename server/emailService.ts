import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<boolean> {
  const resetUrl = `${process.env.NODE_ENV === 'production' ? 'https://' : 'http://'}${process.env.REPLIT_DEV_DOMAIN || 'localhost:5000'}/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello ${userName},</p>
          <p>We received a request to reset your password for your LitPlatform account.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour for security purposes.</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>Best regards,<br>The LitPlatform Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
    Hello ${userName},

    We received a request to reset your password for your LitPlatform account.

    Please click on the following link to reset your password:
    ${resetUrl}

    This link will expire in 1 hour for security purposes.

    If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

    Best regards,
    The LitPlatform Team
  `;

  return sendEmail({
    to: email,
    from: 'noreply@litplatform.app', // Update with your verified sender email
    subject: 'Reset Your LitPlatform Password',
    text: textContent,
    html: htmlContent
  });
}
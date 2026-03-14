/**
 * Email Templates for Digital Menu Application
 * Professional HTML email templates for various notifications
 */

/**
 * Generate OTP email template
 * @param {string} otp - 6-digit OTP code
 * @param {string} userName - User's name (optional)
 * @returns {Object} - { subject, text, html }
 */
const otpEmailTemplate = (otp, userName = 'User') => {
  const subject = 'Your Password Reset OTP - Digital Menu';
  
  const text = `
Hello ${userName},

Your OTP for password reset is: ${otp}

This OTP will expire in 3 minutes.

If you did not request this, please ignore this email and your password will remain unchanged.

Best regards,
Digital Menu Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset OTP</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                🔐 Digital Menu
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Password Reset Request
              </h2>
              
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hello <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 32px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Use the OTP code below to proceed with resetting your password:
              </p>

              <!-- OTP Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 32px;">
                <tr>
                  <td align="center" style="padding: 32px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; border: 2px dashed #FF6B35;">
                    <div style="font-size: 48px; font-weight: 700; color: #FF6B35; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                      ${otp}
                    </div>
                    <p style="margin: 16px 0 0; color: #6c757d; font-size: 14px;">
                      This code expires in <strong>3 minutes</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <div style="padding: 20px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 0 0 24px;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                  <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Digital Menu staff will never ask for your OTP.
                </p>
              </div>

              <p style="margin: 0 0 16px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 12px; color: #6c757d; font-size: 14px; text-align: center;">
                This is an automated message from Digital Menu. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Digital Menu. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, text, html };
};

/**
 * Generate password reset confirmation email template
 * @param {string} userName - User's name (optional)
 * @returns {Object} - { subject, text, html }
 */
const passwordResetConfirmationTemplate = (userName = 'User') => {
  const subject = 'Password Reset Successful - Digital Menu';
  
  const text = `
Hello ${userName},

Your password has been successfully reset.

You can now log in to your Digital Menu account with your new password.

If you did not make this change, please contact our support team immediately at support@digitalmenu.com

Best regards,
Digital Menu Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 12px 12px 0 0;">
              <div style="font-size: 64px; margin-bottom: 16px;">✅</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Password Reset Successful
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hello <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Your password has been successfully reset. You can now log in to your Digital Menu account with your new password.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
                <tr>
                  <td align="center" style="padding: 24px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/login" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Log In to Your Account
                    </a>
                  </td>
                </tr>
              </table>

              <div style="padding: 20px; background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px; margin: 0 0 24px;">
                <p style="margin: 0; color: #721c24; font-size: 14px; line-height: 1.5;">
                  <strong>🚨 Didn't make this change?</strong><br>
                  If you did not reset your password, please contact our support team immediately at <a href="mailto:support@digitalmenu.com" style="color: #721c24; text-decoration: underline;">support@digitalmenu.com</a>
                </p>
              </div>

              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                For your security, we recommend:
              </p>
              <ul style="margin: 12px 0 0; padding-left: 20px; color: #6c757d; font-size: 14px; line-height: 1.8;">
                <li>Using a strong, unique password</li>
                <li>Enabling two-factor authentication (if available)</li>
                <li>Never sharing your password with anyone</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 12px; color: #6c757d; font-size: 14px; text-align: center;">
                This is an automated message from Digital Menu. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Digital Menu. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, text, html };
};

/**
 * Generate welcome email template
 * @param {string} userName - User's name
 * @param {string} userRole - User's role (admin, shopkeeper, customer)
 * @returns {Object} - { subject, text, html }
 */
const welcomeEmailTemplate = (userName, userRole = 'customer') => {
  const subject = 'Welcome to Digital Menu! 🎉';
  
  const text = `
Hello ${userName},

Welcome to Digital Menu! We're excited to have you on board.

Your account has been successfully created as a ${userRole}.

Get started by logging in to your account and exploring all the features we have to offer.

Best regards,
Digital Menu Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Digital Menu</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); border-radius: 12px 12px 0 0;">
              <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Welcome to Digital Menu!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 18px; line-height: 1.6;">
                Hello <strong>${userName}</strong>,
              </p>
              
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Welcome aboard! Your account has been successfully created as a <strong>${userRole}</strong>.
              </p>

              <p style="margin: 0 0 32px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                We're excited to have you join our community. Get started by exploring all the features Digital Menu has to offer!
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 24px;">
                <tr>
                  <td align="center" style="padding: 24px;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/login" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px; color: #4a4a4a; font-size: 16px; font-weight: 600;">
                Need help getting started?
              </p>
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                Check out our documentation or contact our support team at <a href="mailto:support@digitalmenu.com" style="color: #FF6B35; text-decoration: none;">support@digitalmenu.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 12px; color: #6c757d; font-size: 14px; text-align: center;">
                This is an automated message from Digital Menu. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} Digital Menu. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, text, html };
};

module.exports = {
  otpEmailTemplate,
  passwordResetConfirmationTemplate,
  welcomeEmailTemplate
};

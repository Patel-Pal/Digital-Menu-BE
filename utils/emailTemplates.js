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

/**
 * Contact form acknowledgment email to the user
 * @param {string} userName - User's name
 * @returns {Object} - { subject, text, html }
 */
const contactAcknowledgmentTemplate = (userName) => {
  const subject = 'Thank You for Contacting Digital Menu';

  const text = `
Dear ${userName},

Thank you for reaching out to Digital Menu. We have received your message and our team is reviewing it.

We typically respond within 24 hours during business days. In the meantime, feel free to explore our platform and discover how Digital Menu can transform your restaurant's dining experience.

If your inquiry is urgent, please don't hesitate to call us directly.

Warm regards,
The Digital Menu Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Us</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border-radius: 12px 12px 0 0;">
              <div style="font-size: 64px; margin-bottom: 16px;">📩</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Thank You for Reaching Out!
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Dear <strong>${userName}</strong>,
              </p>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Thank you for contacting Digital Menu. We have successfully received your message and our team is already reviewing it.
              </p>
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                We typically respond within <strong>24 hours</strong> during business days. Rest assured, your inquiry is important to us and we will get back to you as soon as possible.
              </p>
              <div style="padding: 20px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; margin: 0 0 24px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                  In the meantime, explore how Digital Menu can transform your restaurant's dining experience with QR code menus, real-time analytics, and more.
                </p>
              </div>
              <p style="margin: 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Warm regards,<br><strong>The Digital Menu Team</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 12px; color: #6c757d; font-size: 14px; text-align: center;">
                This is an automated message from Digital Menu. Please do not reply to this email.
              </p>
              <p style="margin: 0; color: #adb5bd; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Digital Menu. All rights reserved.
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
 * Contact form notification email to admin
 * @param {Object} details - { name, email, message }
 * @returns {Object} - { subject, text, html }
 */
const contactNotificationTemplate = ({ name, email, message }) => {
  const subject = `New Contact Inquiry from ${name} - Digital Menu`;

  const text = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Please respond to this inquiry at your earliest convenience.
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); border-radius: 12px 12px 0 0;">
              <div style="font-size: 64px; margin-bottom: 16px;">📬</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                New Contact Inquiry
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                You have received a new contact form submission on Digital Menu.
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 0 0 24px; border: 1px solid #e9ecef; border-radius: 8px;">
                <tr>
                  <td style="padding: 16px 20px; background-color: #f8f9fa; font-weight: 600; color: #495057; width: 120px; border-bottom: 1px solid #e9ecef;">Name</td>
                  <td style="padding: 16px 20px; color: #212529; border-bottom: 1px solid #e9ecef;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; background-color: #f8f9fa; font-weight: 600; color: #495057; border-bottom: 1px solid #e9ecef;">Email</td>
                  <td style="padding: 16px 20px; color: #212529; border-bottom: 1px solid #e9ecef;">
                    <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 20px; background-color: #f8f9fa; font-weight: 600; color: #495057; vertical-align: top;">Message</td>
                  <td style="padding: 16px 20px; color: #212529; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
              </table>
              <p style="margin: 0 0 8px; color: #6c757d; font-size: 13px;">
                <strong>Submitted at:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 24px 0 0;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                      Reply to ${name}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px; background-color: #f8f9fa; border-radius: 0 0 12px 12px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #adb5bd; font-size: 12px; text-align: center;">
                &copy; ${new Date().getFullYear()} Digital Menu. All rights reserved.
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
 * Shopkeeper welcome email — sent to the new shopkeeper on registration
 * @param {string} userName
 * @param {string} userEmail
 * @returns {Object} - { subject, text, html }
 */
const shopkeeperWelcomeTemplate = (userName, userEmail) => {
  const subject = '🎉 Welcome to Digital Menu — Your Shop Awaits!';
  const loginUrl = `${process.env.FRONTEND_URL || 'https://digitalmenu.devinpro.co.in'}/auth/login`;
  const settingsUrl = `${process.env.FRONTEND_URL || 'https://digitalmenu.devinpro.co.in'}/shop/settings`;

  const text = `
Hello ${userName},

Welcome to Digital Menu! Your shopkeeper account has been created successfully.

Email: ${userEmail}

Next steps:
1. Log in to your dashboard
2. Complete your shop profile (name, logo, address)
3. Add your menu categories and items
4. Generate your QR code and share it with customers

Login: ${loginUrl}

If you have any questions, reply to this email or contact us at support@digitalmenu.com

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
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <!-- Hero Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#FF6B35 0%,#F7931E 60%,#FFB347 100%);padding:48px 40px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;width:80px;height:80px;line-height:80px;font-size:40px;margin-bottom:20px;">🍽️</div>
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-0.5px;">Welcome Aboard!</h1>
              <p style="margin:0;color:rgba(255,255,255,0.9);font-size:16px;">Your Digital Menu journey starts here</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 40px 0;">
              <p style="margin:0 0 16px;color:#1a1a2e;font-size:20px;font-weight:700;">Hello, ${userName}! 👋</p>
              <p style="margin:0 0 24px;color:#4a5568;font-size:15px;line-height:1.7;">
                Congratulations! Your shopkeeper account on <strong>Digital Menu</strong> has been created successfully. You're now ready to digitize your restaurant and delight your customers.
              </p>

              <!-- Account Info Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f8fc;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:32px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;color:#718096;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.8px;">Account Email</p>
                    <p style="margin:0;color:#2d3748;font-size:15px;font-weight:600;">${userEmail}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Steps -->
          <tr>
            <td style="padding:0 40px 32px;">
              <p style="margin:0 0 20px;color:#1a1a2e;font-size:16px;font-weight:700;">Get started in 4 easy steps:</p>

              <!-- Step 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="44" valign="top">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#F7931E);color:#fff;font-size:15px;font-weight:700;text-align:center;line-height:36px;">1</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0 0 2px;color:#2d3748;font-size:14px;font-weight:600;">Log in to your dashboard</p>
                    <p style="margin:0;color:#718096;font-size:13px;">Access all your tools from one place</p>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="44" valign="top">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#F7931E);color:#fff;font-size:15px;font-weight:700;text-align:center;line-height:36px;">2</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0 0 2px;color:#2d3748;font-size:14px;font-weight:600;">Complete your shop profile</p>
                    <p style="margin:0;color:#718096;font-size:13px;">Add your shop name, logo, address &amp; contact info</p>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td width="44" valign="top">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#F7931E);color:#fff;font-size:15px;font-weight:700;text-align:center;line-height:36px;">3</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0 0 2px;color:#2d3748;font-size:14px;font-weight:600;">Build your digital menu</p>
                    <p style="margin:0;color:#718096;font-size:13px;">Add categories, items, prices &amp; photos</p>
                  </td>
                </tr>
              </table>

              <!-- Step 4 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0;">
                <tr>
                  <td width="44" valign="top">
                    <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#FF6B35,#F7931E);color:#fff;font-size:15px;font-weight:700;text-align:center;line-height:36px;">4</div>
                  </td>
                  <td style="padding-left:12px;">
                    <p style="margin:0 0 2px;color:#2d3748;font-size:14px;font-weight:600;">Generate &amp; share your QR code</p>
                    <p style="margin:0;color:#718096;font-size:13px;">Let customers scan and order instantly</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#FF6B35 0%,#F7931E 100%);">
                    <a href="${loginUrl}" style="display:inline-block;padding:16px 40px;color:#ffffff;text-decoration:none;font-size:16px;font-weight:700;border-radius:10px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
              <a href="${settingsUrl}" style="color:#FF6B35;font-size:14px;text-decoration:none;font-weight:500;">Complete your shop profile</a>
            </td>
          </tr>

          <!-- Support Note -->
          <tr>
            <td style="padding:24px 40px;background:#f7f8fc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#718096;font-size:13px;text-align:center;line-height:1.6;">
                Need help? Contact us at <a href="mailto:support@digitalmenu.com" style="color:#FF6B35;text-decoration:none;font-weight:600;">support@digitalmenu.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f0f2f5;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#a0aec0;font-size:12px;">© ${new Date().getFullYear()} Digital Menu. All rights reserved.</p>
              <p style="margin:0;color:#a0aec0;font-size:11px;">This is an automated message — please do not reply directly.</p>
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
 * Admin notification email — sent to admin when a new shopkeeper registers
 * @param {Object} details - { name, email, registeredAt }
 * @returns {Object} - { subject, text, html }
 */
const adminNewShopkeeperTemplate = ({ name, email, registeredAt }) => {
  const subject = `🆕 New Shopkeeper Registered — ${name}`;
  const adminUrl = `${process.env.FRONTEND_URL || 'https://digitalmenu.devinpro.co.in'}/admin/shops`;
  const formattedDate = new Date(registeredAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

  const text = `
New Shopkeeper Registration

Name: ${name}
Email: ${email}
Registered At: ${formattedDate}

View in Admin Panel: ${adminUrl}
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Shopkeeper Registered</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);padding:40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,107,53,0.2);border-radius:50%;width:72px;height:72px;line-height:72px;font-size:36px;margin-bottom:16px;">🏪</div>
              <h1 style="margin:0 0 6px;color:#ffffff;font-size:26px;font-weight:800;">New Shopkeeper Registered</h1>
              <p style="margin:0;color:rgba(255,255,255,0.6);font-size:14px;">Digital Menu Admin Notification</p>
            </td>
          </tr>

          <!-- Alert Badge -->
          <tr>
            <td style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:20px 0 0;">
                    <span style="display:inline-block;background:#fff3e0;color:#e65100;font-size:12px;font-weight:700;padding:6px 16px;border-radius:20px;text-transform:uppercase;letter-spacing:0.8px;">Action Required — Review New Account</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:28px 40px 32px;">
              <p style="margin:0 0 20px;color:#4a5568;font-size:15px;line-height:1.7;">
                A new shopkeeper has just registered on Digital Menu. Here are their details:
              </p>

              <!-- Info Table -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:14px 20px;background:#f7f8fc;border-bottom:1px solid #e2e8f0;" width="140">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Full Name</p>
                  </td>
                  <td style="padding:14px 20px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#2d3748;font-size:15px;font-weight:600;">${name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;background:#f7f8fc;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Email</p>
                  </td>
                  <td style="padding:14px 20px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
                    <a href="mailto:${email}" style="color:#FF6B35;font-size:15px;font-weight:600;text-decoration:none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;background:#f7f8fc;border-bottom:1px solid #e2e8f0;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Role</p>
                  </td>
                  <td style="padding:14px 20px;background:#ffffff;border-bottom:1px solid #e2e8f0;">
                    <span style="display:inline-block;background:#e8f5e9;color:#2e7d32;font-size:12px;font-weight:700;padding:4px 12px;border-radius:12px;">Shopkeeper</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;background:#f7f8fc;">
                    <p style="margin:0;color:#718096;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;">Registered At</p>
                  </td>
                  <td style="padding:14px 20px;background:#ffffff;">
                    <p style="margin:0;color:#2d3748;font-size:14px;">${formattedDate} IST</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                <tr>
                  <td style="border-radius:10px;background:linear-gradient(135deg,#FF6B35 0%,#F7931E 100%);">
                    <a href="${adminUrl}" style="display:inline-block;padding:15px 36px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;border-radius:10px;">
                      View in Admin Panel →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background:#f0f2f5;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0 0 4px;color:#a0aec0;font-size:12px;">© ${new Date().getFullYear()} Digital Menu. All rights reserved.</p>
              <p style="margin:0;color:#a0aec0;font-size:11px;">This is an automated admin notification — do not reply.</p>
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
  welcomeEmailTemplate,
  contactAcknowledgmentTemplate,
  contactNotificationTemplate,
  shopkeeperWelcomeTemplate,
  adminNewShopkeeperTemplate
};

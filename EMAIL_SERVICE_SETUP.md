# Email Service Setup Guide - Digital Menu

## Overview

The Digital Menu application now supports **3 email service providers** for sending OTP and transactional emails:

1. **Resend** (Recommended) - Modern, developer-friendly, great deliverability
2. **Brevo (Sendinblue)** - High volume, affordable, feature-rich
3. **Nodemailer with SMTP** - Traditional, works with any SMTP server

## Quick Start (5 Minutes)

### Option 1: Resend (Recommended) ⭐

**Why Resend?**
- Modern API, excellent documentation
- Great deliverability rates
- Simple setup, no complex configuration
- Free tier: 100 emails/day, 3,000/month
- Perfect for startups and small businesses

**Setup Steps:**

1. **Sign up for Resend**
   - Go to [https://resend.com](https://resend.com)
   - Create a free account
   - Verify your email

2. **Get API Key**
   - Go to API Keys section
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Configure .env**
   ```env
   EMAIL_PROVIDER=resend
   EMAIL_FROM=noreply@yourdomain.com
   RESEND_API_KEY=re_your_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Install dependency**
   ```bash
   npm install node-fetch
   ```

5. **Test it!**
   ```bash
   npm run dev
   # Try forgot password feature
   ```

**Domain Setup (Production):**
- Add your domain in Resend dashboard
- Add DNS records (SPF, DKIM, DMARC)
- Verify domain
- Use `noreply@yourdomain.com` as EMAIL_FROM

---

### Option 2: Brevo (Sendinblue)

**Why Brevo?**
- High volume support
- Affordable pricing
- SMS capabilities included
- Free tier: 300 emails/day
- Great for growing businesses

**Setup Steps:**

1. **Sign up for Brevo**
   - Go to [https://www.brevo.com](https://www.brevo.com)
   - Create a free account
   - Complete verification

2. **Get API Key**
   - Go to SMTP & API → API Keys
   - Click "Generate a new API key"
   - Copy the key

3. **Configure .env**
   ```env
   EMAIL_PROVIDER=brevo
   EMAIL_FROM=noreply@yourdomain.com
   BREVO_API_KEY=your_brevo_api_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Install dependency**
   ```bash
   npm install node-fetch
   ```

5. **Test it!**
   ```bash
   npm run dev
   ```

**Domain Setup (Production):**
- Add sender email in Brevo dashboard
- Verify email address
- Add domain authentication (optional but recommended)

---

### Option 3: Nodemailer with SMTP

**Why Nodemailer?**
- Works with any SMTP server
- No third-party dependency
- Good for existing email infrastructure
- Free if you have SMTP server

**Setup with Gmail:**

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Configure .env**
   ```env
   EMAIL_PROVIDER=nodemailer
   EMAIL_FROM=your-email@gmail.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   FRONTEND_URL=http://localhost:5173
   ```

4. **Test it!**
   ```bash
   npm run dev
   ```

**Setup with Mailtrap (Testing):**

Perfect for development/testing - all emails go to Mailtrap inbox.

1. Sign up at [https://mailtrap.io](https://mailtrap.io)
2. Get SMTP credentials from inbox settings
3. Configure .env:
   ```env
   EMAIL_PROVIDER=nodemailer
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_SECURE=false
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   EMAIL_FROM=noreply@digitalmenu.com
   ```

---

## Testing Email Service

### 1. Verify Configuration

```bash
cd Digital-Menu-BE
node -e "require('./config/emailService').verify()"
```

Expected output:
```
✓ Resend API key configured
# or
✓ Brevo API key configured
# or
✓ Nodemailer SMTP connection verified
```

### 2. Test Forgot Password Flow

1. Start backend server:
   ```bash
   npm run dev
   ```

2. Start frontend:
   ```bash
   cd ../digital-menu-FE
   npm run dev
   ```

3. Test flow:
   - Go to http://localhost:5173/auth/forgot-password
   - Enter your email
   - Check email for OTP
   - Enter OTP and reset password

### 3. Test with cURL

```bash
# Request OTP
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected response:
# {"success":true,"message":"If an account exists with this email, you will receive a password reset OTP."}
```

---

## Comparison Table

| Feature | Resend | Brevo | Nodemailer |
|---------|--------|-------|------------|
| **Setup Difficulty** | ⭐ Easy | ⭐⭐ Medium | ⭐⭐⭐ Complex |
| **Free Tier** | 3,000/month | 9,000/month | Depends on SMTP |
| **Deliverability** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Very Good | ⭐⭐⭐ Good |
| **API Quality** | ⭐⭐⭐⭐⭐ Modern | ⭐⭐⭐⭐ Good | ⭐⭐⭐ Traditional |
| **Documentation** | ⭐⭐⭐⭐⭐ Excellent | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐ Good |
| **Pricing** | $20/50k emails | $25/20k emails | Free (SMTP costs) |
| **Best For** | Startups, Modern apps | High volume | Existing infrastructure |

---

## Production Checklist

### Before Going Live:

- [ ] Choose email provider based on volume needs
- [ ] Set up custom domain for emails
- [ ] Configure SPF, DKIM, DMARC records
- [ ] Test email deliverability
- [ ] Set up email monitoring/alerts
- [ ] Configure rate limiting
- [ ] Add email templates for all scenarios
- [ ] Test spam score of emails
- [ ] Set up email analytics
- [ ] Configure bounce handling

### Security Best Practices:

- [ ] Never commit API keys to git
- [ ] Use environment variables for all secrets
- [ ] Rotate API keys regularly
- [ ] Monitor for unusual email activity
- [ ] Implement rate limiting on forgot-password endpoint
- [ ] Add CAPTCHA to prevent abuse
- [ ] Log all email sending attempts
- [ ] Set up alerts for failed emails

---

## Troubleshooting

### Email Not Sending

**Check 1: Verify Configuration**
```bash
node -e "require('./config/emailService').verify()"
```

**Check 2: Check Logs**
```bash
# Look for error messages in console
npm run dev
```

**Check 3: Test API Key**
- Resend: Check dashboard for API key status
- Brevo: Verify API key hasn't expired
- Nodemailer: Test SMTP credentials

### Email Goes to Spam

**Solutions:**
1. Set up SPF, DKIM, DMARC records
2. Use a verified domain
3. Avoid spam trigger words
4. Include unsubscribe link
5. Maintain good sender reputation

### Rate Limiting Issues

**Resend:**
- Free: 100/day, 3,000/month
- Upgrade plan if needed

**Brevo:**
- Free: 300/day
- Upgrade plan if needed

**Gmail:**
- Limit: 500/day
- Use business email service for higher limits

---

## Email Templates

The application includes professional HTML email templates:

1. **OTP Email** - Password reset OTP with security warnings
2. **Password Reset Confirmation** - Success notification
3. **Welcome Email** - New user registration (optional)

Templates are located in: `utils/emailTemplates.js`

### Customizing Templates

Edit `utils/emailTemplates.js` to customize:
- Colors and branding
- Logo and images
- Text content
- Layout and styling

---

## API Reference

### Email Service Methods

```javascript
const emailService = require('./config/emailService');

// Send email
await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Your Subject',
  text: 'Plain text content',
  html: '<h1>HTML content</h1>',
  from: 'noreply@yourdomain.com' // optional
});

// Verify configuration
await emailService.verify();
```

### Email Templates

```javascript
const { otpEmailTemplate, passwordResetConfirmationTemplate } = require('./utils/emailTemplates');

// Generate OTP email
const otpEmail = otpEmailTemplate('123456', 'John Doe');
// Returns: { subject, text, html }

// Generate confirmation email
const confirmEmail = passwordResetConfirmationTemplate('John Doe');
// Returns: { subject, text, html }
```

---

## Cost Estimation

### Resend
- Free: 3,000 emails/month
- Pro: $20/month for 50,000 emails
- Scale: $80/month for 500,000 emails

### Brevo
- Free: 9,000 emails/month (300/day)
- Starter: $25/month for 20,000 emails
- Business: $65/month for 100,000 emails

### Nodemailer (Gmail)
- Free: 500 emails/day
- Google Workspace: $6/user/month (2,000/day)

---

## Support

### Getting Help

1. **Email Service Issues:**
   - Resend: [https://resend.com/docs](https://resend.com/docs)
   - Brevo: [https://developers.brevo.com](https://developers.brevo.com)
   - Nodemailer: [https://nodemailer.com](https://nodemailer.com)

2. **Application Issues:**
   - Check logs in console
   - Review this documentation
   - Test with cURL commands

3. **Common Issues:**
   - API key invalid → Regenerate key
   - Emails not arriving → Check spam folder
   - Rate limit exceeded → Upgrade plan or wait

---

## Next Steps

1. Choose your email provider
2. Follow setup steps above
3. Test the forgot password flow
4. Configure domain for production
5. Monitor email deliverability
6. Set up alerts and logging

**Recommended for most users:** Start with **Resend** for its simplicity and excellent deliverability.

---

**Last Updated:** February 2026
**Version:** 2.0

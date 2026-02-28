# Quick Email Setup - 5 Minutes ⚡

## Choose Your Provider

### Option 1: Resend (Easiest) ⭐

1. **Sign up:** [https://resend.com](https://resend.com)
2. **Get API key:** Dashboard → API Keys → Create
3. **Update .env:**
   ```env
   EMAIL_PROVIDER=resend
   RESEND_API_KEY=re_your_key_here
   EMAIL_FROM=noreply@yourdomain.com
   ```
4. **Install & Test:**
   ```bash
   npm install
   node test-email-service.js your-email@example.com
   ```

### Option 2: Gmail (Quick Test)

1. **Enable 2FA:** [Google Account Security](https://myaccount.google.com/security)
2. **Get App Password:** [App Passwords](https://myaccount.google.com/apppasswords)
3. **Update .env:**
   ```env
   EMAIL_PROVIDER=nodemailer
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```
4. **Test:**
   ```bash
   npm install
   node test-email-service.js your-email@gmail.com
   ```

### Option 3: Mailtrap (Testing Only)

1. **Sign up:** [https://mailtrap.io](https://mailtrap.io)
2. **Get credentials:** Inbox → SMTP Settings
3. **Update .env:**
   ```env
   EMAIL_PROVIDER=nodemailer
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_SECURE=false
   EMAIL_USER=your-mailtrap-user
   EMAIL_PASSWORD=your-mailtrap-pass
   EMAIL_FROM=noreply@digitalmenu.com
   ```
4. **Test:**
   ```bash
   npm install
   node test-email-service.js test@example.com
   ```

## Test Forgot Password

1. **Start servers:**
   ```bash
   # Terminal 1: Backend
   npm run dev
   
   # Terminal 2: Frontend
   cd ../digital-menu-FE
   npm run dev
   ```

2. **Test flow:**
   - Go to http://localhost:5173/auth/forgot-password
   - Enter email
   - Check inbox for OTP
   - Enter OTP and reset password

## Troubleshooting

**Email not sending?**
```bash
node test-email-service.js your-email@example.com
```

**Still not working?**
- Check .env file has correct values
- Verify API key is valid
- Check spam folder
- Review EMAIL_SERVICE_SETUP.md for detailed help

## Production Setup

Before going live:
1. Use Resend or Brevo (not Gmail)
2. Set up custom domain
3. Configure DNS records (SPF, DKIM)
4. Test deliverability
5. Add rate limiting

See EMAIL_SERVICE_SETUP.md for complete production guide.

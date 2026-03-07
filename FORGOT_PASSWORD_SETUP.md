# Quick Setup Guide - Forgot Password Feature

## 📋 Quick Summary

This guide provides step-by-step instructions to set up the Forgot Password feature for your Digital Menu application.

## ⚡ 5-Minute Setup

### Step 1: Backend Environment Variables

Update your `.env` file with email configuration:

```env
# Email Service (Gmail recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Step 2: Install Dependencies (if needed)

```bash
cd Digital-Menu-BE
npm install bcryptjs nodemailer
```

These are likely already installed, but ensure they're present.

### Step 3: Frontend Environment

Ensure your frontend has:

```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Verify Routes Are Registered

Check that `ForgotPasswordPage` and `ResetPasswordPage` are imported and added to your router.

Example in your App routing:

```tsx
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';

// In your routes:
{
  path: '/auth/forgot-password',
  element: <ForgotPasswordPage />
},
{
  path: '/auth/reset-password',
  element: <ResetPasswordPage />
}
```

### Step 5: Test It!

1. **Start both servers:**
   ```bash
   # Terminal 1: Backend
   cd Digital-Menu-BE
   npm run dev
   
   # Terminal 2: Frontend
   cd digital-menu-builder
   npm run dev
   ```

2. **Test the flow:**
   - Navigate to `/auth/forgot-password`
   - Enter a user's email
   - Check email for reset link (use Mailtrap if testing)
   - Click link and reset password
   - Login with new password ✓

---

## 🔐 Email Service Setup

### Option A: Gmail (Recommended for Development)

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. Add to `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### Option B: Mailtrap (Best for Testing)

1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Create inbox and get SMTP credentials
3. Add to `.env`:
   ```env
   EMAIL_HOST=smtp.mailtrap.io
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=mailtrap-user
   EMAIL_PASSWORD=mailtrap-password
   ```
4. All emails go to Mailtrap inbox - perfect for testing!

### Option C: SendGrid (Production Ready)

1. Create SendGrid account
2. Get API key
3. Add to `.env`:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   ```

---

## 📁 Files Modified/Created

### Backend Files

```
Digital-Menu-BE/
├── models/User.js                          ✅ UPDATED - Added reset token fields
├── config/nodemailer.js                    ✅ UPDATED - Email configuration
├── utils/emailTemplates.js                 ✅ NEW - HTML email template
├── controllers/authController.js           ✅ UPDATED - Added password reset methods
├── routes/auth.js                          ✅ UPDATED - Added password reset routes
├── .env.example                            ✅ NEW - Environment template
└── FORGOT_PASSWORD_GUIDE.md                ✅ NEW - Full documentation
```

### Frontend Files

```
digital-menu-builder/src/
├── pages/auth/
│   ├── ForgotPasswordPage.tsx              ✅ UPDATED - Complete implementation
│   └── ResetPasswordPage.tsx               ✅ NEW - Reset password form
├── services/
│   └── passwordResetService.ts             ✅ NEW - API service layer
└── App.tsx (or router)                     ⚠️  VERIFY - Routes are registered
```

---

## 🧪 Testing Checklist

### Quick Test

```bash
# 1. Test forgot password endpoint
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Expected: { "success": true, "message": "..." }

# 2. Verify token endpoint
curl "http://localhost:5000/api/auth/verify-reset-token?token=xyz&email=test@example.com"

# Expected: { "valid": false, "message": "Invalid token" }
```

### UI Test

- [ ] Go to `/auth/forgot-password`
- [ ] Enter email and submit
- [ ] See success message
- [ ] Check email for reset link
- [ ] Click link → goes to `/auth/reset-password`
- [ ] Enter new password
- [ ] Password updates successfully
- [ ] Can login with new password

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcryptjs (12 rounds)
- ✅ Reset tokens hashed before storage (SHA256)
- ✅ Tokens expire after 1 hour
- ✅ Tokens deleted after use
- ✅ Email doesn't reveal user existence
- ✅ HTTPS recommended for production
- ✅ Rate limiting recommended for `/forgot-password`

---

## 🚀 Production Checklist

Before going live:

- [ ] Use SendGrid or similar service (not Gmail)
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Enable HTTPS only
- [ ] Add rate limiting to forgot-password endpoint
- [ ] Test email delivery in production
- [ ] Monitor email sending errors
- [ ] Update password reset link to use production domain
- [ ] Test complete flow in production environment
- [ ] Add analytics for password reset attempts
- [ ] Consider adding CAPTCHA to prevent abuse

---

## 🐛 Common Issues & Fixes

### Email Not Sending

**Error:** `Error sending password reset email`

**Fix:**
1. Verify `.env` variables are correct
2. Check email service credentials
3. Ensure port 587 is accessible
4. For Gmail: Enable "Less Secure App Access"

```javascript
// Test transporter
const transporter = require('./config/nodemailer');
transporter.verify((err, success) => {
  if (err) console.log('ERROR:', err);
  else console.log('Ready to send emails!');
});
```

### Token Invalid

**Error:** `Invalid or expired reset token`

**Fix:**
1. Token must be used within 1 hour
2. Token can only be used once
3. Email must match token's email
4. Request new token if expired

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Fix:**
```javascript
// In server.js, ensure CORS is configured:
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## 📞 Support

For more details, see [FORGOT_PASSWORD_GUIDE.md](./FORGOT_PASSWORD_GUIDE.md)

Quick checklist:
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Email service configured
- [ ] Routes registered in frontend
- [ ] Can send/receive emails
- [ ] Password reset works end-to-end
- [ ] New password works on login


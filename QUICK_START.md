# 🚀 Quick Start Guide - Forgot Password Feature

## Installation

```bash
cd Digital-Menu-BE
npm install nodemailer
```

## Configuration

### 1. Update `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### 2. Get Gmail App Password:

1. Go to: https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail" → "Other (Digital Menu)"
5. Copy the 16-character password
6. Paste in `.env` as `EMAIL_PASSWORD`

## Testing

### Start the server:
```bash
npm run dev
```

### Run test script:
```bash
node test-forgot-password.js
```

### Manual API Testing:

**1. Request OTP:**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**2. Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "otp": "123456"}'
```

**3. Reset Password:**
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "newPassword": "newpass123",
    "confirmPassword": "newpass123"
  }'
```

## Frontend Integration

The frontend is already integrated! Just start both servers:

**Backend:**
```bash
cd Digital-Menu-BE
npm run dev
```

**Frontend:**
```bash
cd digital-menu-builder
npm run dev
```

Then visit: http://localhost:8080/auth/forgot-password

## Features

✅ 6-digit OTP generation  
✅ 10-minute OTP expiry  
✅ Email notifications with HTML templates  
✅ User enumeration prevention  
✅ Password validation  
✅ Secure password hashing  
✅ Complete frontend UI with 3-step flow  

## Troubleshooting

**Email not sending?**
- Check SMTP credentials in `.env`
- Verify Gmail App Password is correct
- Check firewall/port 587 is open

**OTP not working?**
- Check server time is correct
- Verify OTP hasn't expired (10 minutes)
- Check database for OTP value

For detailed documentation, see `FORGOT_PASSWORD_SETUP.md`

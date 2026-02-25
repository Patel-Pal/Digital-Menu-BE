# 🔧 Quick Fix: Gmail Authentication Error

## Your Error
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

## ⚡ Quick Solution (5 minutes)

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow setup (need your phone)

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select: **Mail** → **Other (Custom name)**
3. Enter: "Digital Menu"
4. Click "Generate"
5. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)

### Step 3: Update .env
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**⚠️ IMPORTANT:**
- Remove ALL spaces from password: `abcdefghijklmnop` ✅
- NOT: `abcd efgh ijkl mnop` ❌
- Use your ACTUAL Gmail address
- Use App Password, NOT your regular password

### Step 4: Restart Server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test
```bash
node test-smtp.js
```

---

## 🚀 Alternative: Use Mailtrap (Instant Setup)

**No Gmail hassle! Perfect for testing:**

1. **Sign up:** https://mailtrap.io/ (free)
2. **Get credentials** from inbox settings
3. **Update .env:**
   ```env
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_SECURE=false
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   ```
4. **Restart server**
5. **Test:** `node test-smtp.js`

**Benefits:**
- ✅ Works instantly
- ✅ No Gmail setup needed
- ✅ Catches all test emails
- ✅ Perfect for development

---

## 📋 Checklist

Before testing:
- [ ] 2-Step Verification enabled
- [ ] App Password generated
- [ ] Password has NO spaces
- [ ] Using actual Gmail address
- [ ] .env file updated
- [ ] Server restarted

---

## 🧪 Test Commands

```bash
# Test SMTP connection
node test-smtp.js

# Test forgot password flow
node test-forgot-password.js
```

---

## ❓ Still Not Working?

### Check These:

1. **App Password not showing?**
   - Enable 2-Step Verification first
   - Wait 5 minutes
   - Sign out and back in

2. **Still getting auth error?**
   - Double-check email address
   - Verify no spaces in password
   - Try generating new App Password

3. **Connection timeout?**
   - Check firewall
   - Try port 465: `EMAIL_PORT=465` and `EMAIL_SECURE=true`

4. **Want quick solution?**
   - Use Mailtrap (see above)
   - Works immediately!

---

## 📚 More Help

- **Detailed guide:** `EMAIL_SETUP_GUIDE.md`
- **Test script:** `node test-smtp.js`
- **Troubleshooting:** Check server logs

---

## 💡 Recommended for Production

Don't use Gmail in production! Use:
- **SendGrid** (100 emails/day free)
- **AWS SES** ($0.10 per 1,000 emails)
- **Mailgun** (Good free tier)

See `EMAIL_SETUP_GUIDE.md` for setup instructions.

---

**Quick Start:** Use Mailtrap for testing, then switch to SendGrid for production! 🚀

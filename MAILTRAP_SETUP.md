# 📧 Mailtrap Setup - Instant Email Testing (No Gmail Needed!)

## Why Mailtrap?

✅ **Works instantly** - No complex setup  
✅ **Free for testing** - Perfect for development  
✅ **Catches all emails** - View them in web interface  
✅ **No real emails sent** - Safe for testing  
✅ **No Gmail hassle** - Skip the App Password setup  

---

## 🚀 Setup (2 Minutes)

### Step 1: Sign Up for Mailtrap

1. Go to: **https://mailtrap.io/**
2. Click "Sign Up" (free account)
3. Sign up with email or Google/GitHub

### Step 2: Get SMTP Credentials

1. After login, you'll see "Email Testing" → "Inboxes"
2. Click on "My Inbox" (or create new inbox)
3. Click "SMTP Settings" tab
4. Select "Nodemailer" from integrations dropdown
5. You'll see credentials like:

```javascript
host: 'sandbox.smtp.mailtrap.io',
port: 2525,
auth: {
  user: '1a2b3c4d5e6f7g',
  pass: '9h8i7j6k5l4m3n'
}
```

### Step 3: Update Your .env File

Replace your Gmail settings with Mailtrap:

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=1a2b3c4d5e6f7g
EMAIL_PASSWORD=9h8i7j6k5l4m3n
```

**Replace with YOUR actual Mailtrap credentials!**

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 5: Test

```bash
node test-smtp.js
```

You should see: ✅ SMTP connection successful!

---

## 📬 How to View Test Emails

1. Go to: https://mailtrap.io/
2. Login to your account
3. Click "Email Testing" → "My Inbox"
4. All test emails will appear here!

You can:
- View HTML and text versions
- Check email headers
- Test spam score
- Forward to real email

---

## 🧪 Test the Forgot Password Feature

```bash
# Test forgot password
node test-forgot-password.js
```

When prompted, enter a test email (any email works with Mailtrap):
```
test@example.com
```

Then:
1. Go to Mailtrap inbox
2. Open the email
3. Copy the 6-digit OTP
4. Paste it in the terminal
5. Complete the password reset

---

## ✅ Complete .env Example

Here's what your `.env` should look like:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://pal:pal082004@cluster0.am7a6ou.mongodb.net/digital-menu?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=dfmvday8x
CLOUDINARY_API_KEY=555552726469738
CLOUDINARY_API_SECRET=Qn2Yqbv6Cn2hzukZYIpnP1rBCCE

# Mailtrap Email Configuration (for testing)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
```

---

## 🎯 Benefits for Development

### With Mailtrap:
- ✅ No Gmail App Password needed
- ✅ No 2-Step Verification setup
- ✅ Works instantly
- ✅ View all test emails in one place
- ✅ No risk of sending emails to real users
- ✅ Test spam score and deliverability
- ✅ Free tier: 500 emails/month

### Without Mailtrap (Gmail):
- ❌ Need to enable 2-Step Verification
- ❌ Generate App Password
- ❌ Risk of account lockout
- ❌ Daily sending limits
- ❌ Can't easily view test emails

---

## 🔄 Switching to Production Later

When ready for production, simply update `.env`:

**SendGrid (Recommended):**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

**AWS SES:**
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-username
EMAIL_PASSWORD=your-ses-password
```

No code changes needed - just update environment variables!

---

## 📊 Mailtrap Features

### Email Testing:
- View HTML/Text versions
- Check responsive design
- Test email clients
- Validate HTML/CSS

### Debugging:
- View raw email source
- Check headers
- Test spam score
- Validate SPF/DKIM

### Team Collaboration:
- Share inbox with team
- Multiple inboxes
- Email forwarding
- API access

---

## 💡 Pro Tips

1. **Create separate inboxes** for different features:
   - "Password Reset" inbox
   - "Welcome Emails" inbox
   - "Notifications" inbox

2. **Use email forwarding** to test on real devices:
   - Forward to your real email
   - Test on mobile/desktop

3. **Check spam score** before production:
   - Mailtrap shows spam score
   - Fix issues before going live

4. **Use API** for automated testing:
   - Mailtrap has REST API
   - Verify emails in tests

---

## 🆚 Comparison

| Feature | Mailtrap | Gmail |
|---------|----------|-------|
| Setup Time | 2 minutes | 10+ minutes |
| Complexity | Very Easy | Complex |
| 2FA Required | No | Yes |
| App Password | No | Yes |
| View Emails | Web Interface | Email Client |
| Safe Testing | Yes | Risk of real sends |
| Free Tier | 500/month | 500/day |
| Best For | Development | Production (not recommended) |

---

## ❓ FAQ

**Q: Is Mailtrap free?**  
A: Yes! Free tier includes 500 emails/month, perfect for development.

**Q: Will emails be sent to real users?**  
A: No! Mailtrap catches all emails. Nothing is sent to real addresses.

**Q: Can I use this in production?**  
A: No, Mailtrap is for testing only. Use SendGrid/AWS SES for production.

**Q: How do I view the emails?**  
A: Login to mailtrap.io and check your inbox.

**Q: Can I test with any email address?**  
A: Yes! Use any email (test@example.com, user@test.com, etc.)

**Q: Do I need to verify my domain?**  
A: No! That's only needed for production email services.

---

## 🚀 Quick Start Checklist

- [ ] Sign up at mailtrap.io
- [ ] Get SMTP credentials
- [ ] Update .env file
- [ ] Restart server
- [ ] Run `node test-smtp.js`
- [ ] Run `node test-forgot-password.js`
- [ ] Check Mailtrap inbox for emails

---

## 📞 Need Help?

1. **Can't find credentials?**
   - Login to Mailtrap
   - Go to "Email Testing" → "Inboxes"
   - Click "SMTP Settings"

2. **Still getting errors?**
   - Double-check credentials
   - Ensure no extra spaces
   - Restart server after .env changes

3. **Emails not showing?**
   - Check correct inbox
   - Refresh the page
   - Check spam folder (in Mailtrap)

---

**🎉 That's it! You're ready to test emails without any Gmail hassle!**

Start testing: `node test-forgot-password.js`

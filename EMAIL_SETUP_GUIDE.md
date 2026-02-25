# 📧 Email Setup Guide - Fix Gmail Authentication

## The Error You're Seeing

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

This means Gmail is rejecting your credentials. Here's how to fix it:

---

## ✅ Solution 1: Gmail App Password (Recommended)

### Step 1: Enable 2-Step Verification

1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click "2-Step Verification"
4. Follow the setup process (you'll need your phone)

### Step 2: Generate App Password

1. After enabling 2-Step Verification, go back to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click "App passwords" (or "2-Step Verification" → "App passwords")
4. You may need to sign in again
5. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
6. Enter: "Digital Menu Backend"
7. Click "Generate"
8. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```

**Important:**
- Remove ALL spaces from the app password
- Use your actual Gmail address for EMAIL_USER
- Don't use your regular Gmail password

### Step 4: Test

```bash
node test-forgot-password.js
```

---

## ✅ Solution 2: Enable "Less Secure Apps" (Not Recommended)

**⚠️ Warning:** This is less secure and Google may disable it.

1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Update `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-regular-gmail-password
   ```

---

## ✅ Solution 3: Use Alternative Email Service (Best for Production)

### Option A: Mailtrap (Free for Testing)

Perfect for development/testing:

1. Sign up: https://mailtrap.io/
2. Get SMTP credentials from inbox settings
3. Update `.env`:
   ```env
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_SECURE=false
   EMAIL_USER=your-mailtrap-username
   EMAIL_PASSWORD=your-mailtrap-password
   ```

**Pros:**
- ✅ No setup hassle
- ✅ Catches all emails (won't send to real users)
- ✅ Great for testing
- ✅ Free tier available

### Option B: SendGrid (Free Tier)

Best for production:

1. Sign up: https://sendgrid.com/
2. Create API Key
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASSWORD=your-sendgrid-api-key
   ```

**Pros:**
- ✅ 100 emails/day free
- ✅ Reliable delivery
- ✅ Production-ready
- ✅ Good documentation

### Option C: AWS SES (Pay as you go)

Most cost-effective for production:

1. Set up AWS SES
2. Verify your domain/email
3. Get SMTP credentials
4. Update `.env`:
   ```env
   EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-ses-smtp-username
   EMAIL_PASSWORD=your-ses-smtp-password
   ```

**Pros:**
- ✅ $0.10 per 1,000 emails
- ✅ Highly scalable
- ✅ AWS integration
- ✅ Very reliable

---

## 🔍 Troubleshooting

### Test SMTP Connection

Create `test-smtp.js`:

```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log('Testing SMTP connection...\n');
  console.log('Host:', process.env.EMAIL_HOST);
  console.log('Port:', process.env.EMAIL_PORT);
  console.log('User:', process.env.EMAIL_USER);
  console.log('Password:', process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET');
  console.log('');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    console.log('Server is ready to send emails.');
    
    // Try sending a test email
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: `"Digital Menu Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Digital Menu',
      text: 'If you receive this, your email configuration is working!',
      html: '<b>If you receive this, your email configuration is working!</b>'
    });
    
    console.log('✅ Test email sent!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Fix: Check your email credentials');
      console.log('   - Use App Password (not regular password)');
      console.log('   - Enable 2-Step Verification first');
      console.log('   - Remove spaces from App Password');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Fix: Check your network connection');
      console.log('   - Verify firewall settings');
      console.log('   - Check if port 587 is open');
    }
  }
}

testSMTP();
```

Run:
```bash
node test-smtp.js
```

### Common Issues

**1. "Invalid login" Error**
- ✅ Use App Password, not regular password
- ✅ Enable 2-Step Verification first
- ✅ Remove all spaces from App Password
- ✅ Use correct Gmail address

**2. "Connection timeout" Error**
- ✅ Check firewall settings
- ✅ Try port 465 with `EMAIL_SECURE=true`
- ✅ Check internet connection

**3. "Self-signed certificate" Error**
- ✅ Add to `.env`: `NODE_TLS_REJECT_UNAUTHORIZED=0` (development only!)

**4. App Password option not showing**
- ✅ Enable 2-Step Verification first
- ✅ Wait a few minutes after enabling
- ✅ Try signing out and back in

---

## 📝 Quick Checklist

Before testing, verify:

- [ ] 2-Step Verification is enabled
- [ ] App Password is generated
- [ ] App Password has NO spaces
- [ ] EMAIL_USER is your actual Gmail address
- [ ] EMAIL_PASSWORD is the App Password (not regular password)
- [ ] .env file is in the correct location
- [ ] Server is restarted after .env changes

---

## 🎯 Recommended Setup for Different Environments

### Development/Testing
**Use Mailtrap:**
- No real emails sent
- Easy to test
- Free tier sufficient

### Staging
**Use SendGrid or Gmail:**
- Real emails for testing
- Limited volume OK
- Easy setup

### Production
**Use SendGrid or AWS SES:**
- Reliable delivery
- Scalable
- Professional
- Cost-effective

---

## 📧 Example .env Configurations

### Gmail (Development)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password-no-spaces
```

### Mailtrap (Testing)
```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
```

### SendGrid (Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=SG.your-sendgrid-api-key
```

### AWS SES (Production)
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASSWORD=your-ses-smtp-password
```

---

## 🚀 Next Steps

1. **Choose your email service** (Gmail with App Password for quick start)
2. **Update .env file** with correct credentials
3. **Restart server** (`npm run dev`)
4. **Test connection** (`node test-smtp.js`)
5. **Test forgot password** (`node test-forgot-password.js`)

---

## 💡 Pro Tips

1. **Never commit .env file** - Add to .gitignore
2. **Use environment variables** in production
3. **Monitor email delivery** - Set up alerts
4. **Keep backup service** - Have alternative ready
5. **Test regularly** - Ensure emails are working

---

## 📞 Still Having Issues?

1. Check Gmail security alerts: https://myaccount.google.com/notifications
2. Verify 2-Step Verification is active
3. Try generating a new App Password
4. Check server logs for detailed errors
5. Try alternative email service (Mailtrap)

---

**Need immediate solution?** Use Mailtrap for testing - it works instantly without any Gmail setup!

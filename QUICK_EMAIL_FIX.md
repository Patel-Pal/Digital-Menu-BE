# ⚡ QUICK FIX: Email Not Working

## Your Current Error
```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

## 🎯 INSTANT SOLUTION (2 Minutes)

### Use Mailtrap Instead of Gmail

**Why?** Gmail requires complex setup. Mailtrap works instantly!

---

## Step-by-Step Fix

### 1. Sign Up for Mailtrap (30 seconds)
Go to: **https://mailtrap.io/register/signup**
- Click "Sign Up"
- Use email or Google/GitHub

### 2. Get Credentials (30 seconds)
After login:
1. Click "Email Testing" → "Inboxes"
2. Click "My Inbox"
3. Click "SMTP Settings" tab
4. Select "Nodemailer" from dropdown
5. Copy the credentials shown

Example:
```
host: 'sandbox.smtp.mailtrap.io'
port: 2525
user: '1a2b3c4d5e6f7g'
pass: '9h8i7j6k5l4m3n'
```

### 3. Update .env File (30 seconds)

Open `Digital-Menu-BE/.env` and replace email settings:

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=1a2b3c4d5e6f7g
EMAIL_PASSWORD=9h8i7j6k5l4m3n
```

**⚠️ Use YOUR actual Mailtrap credentials from step 2!**

### 4. Restart Server (10 seconds)
```bash
# Press Ctrl+C to stop
npm run dev
```

### 5. Test (20 seconds)
```bash
node test-smtp.js
```

You should see: **✅ SMTP connection successful!**

---

## 📬 View Your Test Emails

1. Go to: https://mailtrap.io/
2. Login
3. Click "Email Testing" → "My Inbox"
4. All test emails appear here!

---

## 🧪 Test Forgot Password

```bash
node test-forgot-password.js
```

Enter any email (e.g., `test@example.com`)

Then:
1. Check Mailtrap inbox
2. Copy the OTP from email
3. Paste in terminal
4. Complete password reset

---

## ✅ Benefits

✅ Works instantly (no Gmail setup)  
✅ Free for testing (500 emails/month)  
✅ View all emails in web interface  
✅ No risk of sending to real users  
✅ Perfect for development  

---

## 🔄 Your Complete .env

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://pal:pal082004@cluster0.am7a6ou.mongodb.net/digital-menu?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=dfmvday8x
CLOUDINARY_API_KEY=555552726469738
CLOUDINARY_API_SECRET=Qn2Yqbv6Cn2hzukZYIpnP1rBCCE

# Mailtrap (for testing)
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_SECURE=false
EMAIL_USER=your-mailtrap-username-here
EMAIL_PASSWORD=your-mailtrap-password-here
```

---

## 🎉 Done!

That's it! No Gmail App Password, no 2-Step Verification, no hassle!

**Test now:** `node test-forgot-password.js`

---

## 📚 More Info

- **Full guide:** `MAILTRAP_SETUP.md`
- **Email setup:** `EMAIL_SETUP_GUIDE.md`
- **Gmail fix:** `GMAIL_FIX.md`

---

**Need help?** The error is because Gmail needs App Password. Mailtrap is easier! 🚀

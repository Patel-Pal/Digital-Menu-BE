# 🚀 START HERE - Digital Menu Backend Setup

## Welcome!

This is your **one-stop guide** to get the Digital Menu backend running with email notifications.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Email Service
```bash
node setup-email.js
```

This interactive wizard will:
- Help you choose an email provider
- Configure your .env file
- Test email sending
- Verify everything works

### Step 3: Start Server
```bash
npm run dev
```

Server runs on http://localhost:5000

### Step 4: Test Forgot Password

1. Start frontend:
   ```bash
   cd ../digital-menu-FE
   npm run dev
   ```

2. Go to: http://localhost:5173/auth/forgot-password
3. Enter your email
4. Check inbox for OTP
5. Reset password

**Done!** 🎉

---

## 📚 Documentation Guide

### New to the Project?
→ Start with: [README.md](./README.md)

### Setting Up Email?
→ Quick: [QUICK_EMAIL_SETUP.md](./QUICK_EMAIL_SETUP.md) (5 min)  
→ Detailed: [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md) (15 min)

### Migrating from Old System?
→ Read: [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

### Want Implementation Details?
→ Read: [EMAIL_IMPLEMENTATION_SUMMARY.md](./EMAIL_IMPLEMENTATION_SUMMARY.md)

### Ready for Production?
→ Read: [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)

---

## 🎯 What Email Provider Should I Use?

### For Production → **Resend** ⭐
- Modern, easy to use
- Great deliverability
- Free: 3,000 emails/month
- Setup: 2 minutes

### For High Volume → **Brevo**
- More free emails (9,000/month)
- SMS capabilities
- Setup: 5 minutes

### For Testing → **Mailtrap**
- Emails don't actually send
- Perfect for development
- Setup: 2 minutes

### For Quick Test → **Gmail**
- Use existing Gmail account
- Not for production
- Setup: 5 minutes

---

## 🧪 Testing Tools

### Test Email Service
```bash
node test-email-service.js your-email@example.com
```

### Test Forgot Password Flow
```bash
node test-forgot-password.js
```

### Verify Configuration
```bash
node -e "require('./config/emailService').verify()"
```

---

## 📁 Project Structure

```
Digital-Menu-BE/
├── config/
│   ├── emailService.js          ← Multi-provider email service
│   ├── database.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js        ← Uses email service
│   └── ...
├── utils/
│   ├── emailTemplates.js        ← Professional HTML templates
│   └── sendEmail.js             ← (deprecated)
├── test-email-service.js        ← Test email sending
├── setup-email.js               ← Interactive setup wizard
└── .env                         ← Your configuration
```

---

## 🔧 Environment Variables

### Required
```env
# Database
MONGODB_URI=your_mongodb_uri

# JWT
JWT_SECRET=your_secret_key

# Email (choose one provider)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@yourdomain.com

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Optional
```env
# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🐛 Troubleshooting

### Email Not Sending?

1. **Run test script:**
   ```bash
   node test-email-service.js your-email@example.com
   ```

2. **Check configuration:**
   ```bash
   node -e "require('./config/emailService').verify()"
   ```

3. **Check .env file:**
   - EMAIL_PROVIDER is set
   - API key is correct
   - EMAIL_FROM is valid

### Server Won't Start?

1. **Check MongoDB connection:**
   - Verify MONGODB_URI in .env
   - Check MongoDB Atlas is accessible

2. **Check dependencies:**
   ```bash
   npm install
   ```

3. **Check port:**
   - Default: 5000
   - Change in .env: `PORT=5001`

### Need More Help?

- Check [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md)
- Review error logs in console
- Run test scripts
- Check provider dashboard

---

## 🚀 Production Deployment

### Before Going Live

1. **Security:**
   - [ ] Hash OTP before storage
   - [ ] Add rate limiting
   - [ ] Add CAPTCHA
   - [ ] Use HTTPS only

2. **Email:**
   - [ ] Use Resend or Brevo (not Gmail)
   - [ ] Set up custom domain
   - [ ] Configure DNS records
   - [ ] Test deliverability

3. **Monitoring:**
   - [ ] Set up error logging
   - [ ] Configure alerts
   - [ ] Monitor email delivery
   - [ ] Track metrics

See [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) for full checklist.

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Shops
- `GET /api/shops/profile` - Get shop profile
- `POST /api/shops/profile` - Update shop profile

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/shop/:shopId` - Get shop orders
- `PUT /api/orders/:id/status` - Update order status

### Billing
- `POST /api/billing/generate` - Generate bill
- `GET /api/billing/shop/:shopId` - Get shop bills

---

## 🎓 Learning Resources

### Email Service
- [Resend Docs](https://resend.com/docs)
- [Brevo Docs](https://developers.brevo.com)
- [Nodemailer Docs](https://nodemailer.com)

### Node.js
- [Express.js](https://expressjs.com)
- [MongoDB](https://www.mongodb.com/docs)
- [Socket.IO](https://socket.io/docs)

---

## 💡 Tips

### Development
- Use Mailtrap for testing (emails don't actually send)
- Use nodemon for auto-restart: `npm run dev`
- Check logs for errors

### Production
- Use Resend or Brevo
- Set up custom domain
- Monitor email delivery
- Implement rate limiting

### Testing
- Test with real email addresses
- Check spam folder
- Test on mobile devices
- Verify OTP expiration

---

## 🎯 Next Steps

1. ✅ Run `node setup-email.js`
2. ✅ Test forgot password flow
3. ✅ Review security checklist
4. ✅ Plan production deployment

---

## 📞 Support

### Documentation
- [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md) - Detailed setup
- [QUICK_EMAIL_SETUP.md](./QUICK_EMAIL_SETUP.md) - Quick start
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migration help

### Testing
- `test-email-service.js` - Test emails
- `setup-email.js` - Interactive setup
- `test-forgot-password.js` - Test flow

---

**Ready to start?** Run: `node setup-email.js`

**Questions?** Check the documentation files above.

**Issues?** Run the test scripts to diagnose.

---

**Last Updated:** February 28, 2026  
**Version:** 2.0  
**Status:** ✅ Ready to Use

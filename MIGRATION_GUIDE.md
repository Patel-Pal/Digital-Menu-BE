# Migration Guide: Old Email System → New Multi-Provider System

## Overview

This guide helps you migrate from the old Nodemailer-only system to the new multi-provider email service.

## What Changed

### Before (Old System)
```javascript
// utils/sendEmail.js
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({...});
await transporter.sendMail({...});
```

### After (New System)
```javascript
// config/emailService.js
const emailService = require('./config/emailService');
await emailService.sendEmail({...});
```

## Migration Steps

### Step 1: Install Dependencies

```bash
npm install node-fetch
```

### Step 2: Update Environment Variables

**Old .env:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
```

**New .env (Option A - Keep Nodemailer):**
```env
EMAIL_PROVIDER=nodemailer
EMAIL_FROM=your-email@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-password
FRONTEND_URL=http://localhost:5173
```

**New .env (Option B - Switch to Resend):**
```env
EMAIL_PROVIDER=resend
EMAIL_FROM=noreply@yourdomain.com
RESEND_API_KEY=re_your_key_here
FRONTEND_URL=http://localhost:5173
```

### Step 3: No Code Changes Needed!

The `authController.js` has already been updated to use the new email service. Your existing code will work without modifications.

### Step 4: Test

```bash
# Test email service
node test-email-service.js your-email@example.com

# Start server
npm run dev

# Test forgot password
# Go to http://localhost:5173/auth/forgot-password
```

## Backward Compatibility

✅ **100% Backward Compatible**

If you keep `EMAIL_PROVIDER=nodemailer` in your .env, the system works exactly like before. No breaking changes!

## Benefits of Upgrading

### 1. Multiple Provider Support
- Switch providers without code changes
- Test different providers easily
- Fallback options

### 2. Better Email Templates
- Professional HTML design
- Mobile responsive
- Security warnings
- Branded appearance

### 3. Easier Testing
- Test scripts included
- Interactive setup wizard
- Better error messages

### 4. Production Ready
- Better error handling
- Logging
- Monitoring support
- Scalability

## Recommended Upgrade Path

### Phase 1: Keep Current Setup (Week 1)
```env
EMAIL_PROVIDER=nodemailer
# ... keep existing SMTP settings
```
- No changes needed
- Test that everything still works
- Familiarize with new system

### Phase 2: Test Resend (Week 2)
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_test_key
```
- Sign up for Resend
- Test in development
- Compare deliverability

### Phase 3: Production Migration (Week 3)
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_production_key
EMAIL_FROM=noreply@yourdomain.com
```
- Set up custom domain
- Configure DNS records
- Switch production traffic

## Rollback Plan

If you need to rollback:

1. **Change .env:**
   ```env
   EMAIL_PROVIDER=nodemailer
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-password
   ```

2. **Restart server:**
   ```bash
   npm run dev
   ```

That's it! The system automatically switches back to Nodemailer.

## Common Migration Issues

### Issue 1: "Email service not configured"

**Solution:**
```bash
# Check .env file has EMAIL_PROVIDER set
cat .env | grep EMAIL_PROVIDER

# If missing, add it:
echo "EMAIL_PROVIDER=nodemailer" >> .env
```

### Issue 2: "RESEND_API_KEY not found"

**Solution:**
Either:
- Add RESEND_API_KEY to .env, OR
- Change EMAIL_PROVIDER to 'nodemailer'

### Issue 3: "node-fetch not found"

**Solution:**
```bash
npm install node-fetch
```

## Testing Checklist

After migration, test:

- [ ] Email service verification: `node -e "require('./config/emailService').verify()"`
- [ ] Test email: `node test-email-service.js your-email@example.com`
- [ ] Forgot password flow works
- [ ] OTP email received
- [ ] OTP verification works
- [ ] Password reset successful
- [ ] Confirmation email received
- [ ] Can login with new password

## Support

If you encounter issues:

1. Check [EMAIL_SERVICE_SETUP.md](./EMAIL_SERVICE_SETUP.md)
2. Run test script: `node test-email-service.js`
3. Check logs for error messages
4. Verify .env configuration
5. Try rollback plan above

## FAQ

**Q: Do I have to switch providers?**  
A: No! You can keep using Nodemailer. The new system is backward compatible.

**Q: Will my existing emails still work?**  
A: Yes! No changes to email functionality, just better infrastructure.

**Q: Can I test without affecting production?**  
A: Yes! Use Mailtrap for testing:
```env
EMAIL_PROVIDER=nodemailer
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-user
EMAIL_PASSWORD=your-mailtrap-pass
```

**Q: What if I want to switch back?**  
A: Just change EMAIL_PROVIDER in .env and restart. No code changes needed.

**Q: Is this production ready?**  
A: Yes, but implement these security improvements first:
- Hash OTP before storage
- Add rate limiting
- Add CAPTCHA
- Set up monitoring

---

**Migration Status:** ✅ Safe to Migrate  
**Backward Compatibility:** ✅ 100%  
**Rollback Time:** < 1 minute

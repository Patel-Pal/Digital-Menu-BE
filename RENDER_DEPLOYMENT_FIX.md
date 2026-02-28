# 🔧 Fix Render Deployment - Email Service Issues

## Problem

Your Render deployment is getting **500 Internal Server Error** when sending emails because:

1. ❌ Environment variables not configured on Render
2. ❌ Gmail SMTP may timeout on Render's free tier (cold starts)
3. ❌ Render's network may block Gmail SMTP

## Solution: Switch to Resend (Recommended)

Gmail SMTP doesn't work well on serverless/cloud platforms like Render. Use **Resend** instead - it's designed for this!

---

## Quick Fix (5 Minutes)

### Step 1: Sign Up for Resend

1. Go to: https://resend.com
2. Sign up (free account)
3. Verify your email
4. Get API key from dashboard

### Step 2: Configure Render Environment Variables

Go to your Render dashboard → Your service → Environment

**Add these variables:**

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@digitalmenu.com
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Important:** Also add these if not already set:

```env
MONGODB_URI=mongodb+srv://pal:pal082004@cluster0.am7a6ou.mongodb.net/digital-menu?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=dfmvday8x
CLOUDINARY_API_KEY=555552726469738
CLOUDINARY_API_SECRET=Qn2Yqbv6Cn2hzukZYIpnP1rBCCE
```

### Step 3: Redeploy

Render will automatically redeploy when you save environment variables.

Or manually trigger:
- Go to your service
- Click "Manual Deploy" → "Deploy latest commit"

### Step 4: Test

```bash
curl -X POST https://digital-menu-be.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"patelkenil0029@gmail.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "If an account exists with this email, you will receive a password reset OTP."
}
```

---

## Why Gmail Doesn't Work on Render

### Issues with Gmail SMTP on Cloud Platforms:

1. **Timeout Issues**
   - Render free tier has cold starts (30-60 seconds)
   - Gmail SMTP connection times out
   - Results in 500 errors

2. **Network Restrictions**
   - Some cloud platforms block SMTP ports
   - Gmail may block connections from cloud IPs
   - Security policies prevent SMTP

3. **Rate Limiting**
   - Gmail has strict rate limits
   - Cloud IPs may be flagged
   - Connections get rejected

### Why Resend Works Better:

✅ **HTTP API** - No SMTP, uses REST API  
✅ **Fast** - No connection overhead  
✅ **Reliable** - Designed for cloud platforms  
✅ **Better Deliverability** - Professional sender reputation  
✅ **Free Tier** - 3,000 emails/month  

---

## Alternative: Use Brevo (If You Prefer)

If you don't want Resend, use Brevo:

### Step 1: Sign Up for Brevo

1. Go to: https://www.brevo.com
2. Sign up (free account)
3. Get API key from SMTP & API → API Keys

### Step 2: Configure Render

```env
EMAIL_PROVIDER=brevo
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@digitalmenu.com
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 3: Redeploy

---

## Debugging Production Issues

### Check Render Logs

1. Go to Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for error messages

### Common Errors:

**Error: "EMAIL_PROVIDER not defined"**
```
Solution: Add EMAIL_PROVIDER=resend to Render environment variables
```

**Error: "RESEND_API_KEY not found"**
```
Solution: Add RESEND_API_KEY to Render environment variables
```

**Error: "Connection timeout"**
```
Solution: Switch from Gmail to Resend (Gmail SMTP doesn't work on Render)
```

**Error: "getaddrinfo ENOTFOUND smtp.gmail.com"**
```
Solution: Render blocks SMTP. Use Resend API instead.
```

---

## Complete Render Environment Variables

Here's the complete list of environment variables you need on Render:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://pal:pal082004@cluster0.am7a6ou.mongodb.net/digital-menu?retryWrites=true&w=majority&appName=Cluster0

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dfmvday8x
CLOUDINARY_API_KEY=555552726469738
CLOUDINARY_API_SECRET=Qn2Yqbv6Cn2hzukZYIpnP1rBCCE

# Frontend URL
FRONTEND_URL=https://your-frontend-url.vercel.app

# Email Service (IMPORTANT - Use Resend, not Gmail)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@digitalmenu.com
```

---

## Testing After Deployment

### Test 1: Health Check

```bash
curl https://digital-menu-be.onrender.com/api/health
```

Expected:
```json
{"status":"OK","message":"Digital Menu API is running"}
```

### Test 2: Forgot Password

```bash
curl -X POST https://digital-menu-be.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"patelkenil0029@gmail.com"}'
```

Expected:
```json
{
  "success": true,
  "message": "If an account exists with this email, you will receive a password reset OTP."
}
```

### Test 3: Check Email

- Check your Gmail inbox
- Look for email from Digital Menu
- Should arrive within 5-10 seconds

---

## Performance Optimization

### Issue: Slow Email Sending

**Cause:** Render free tier has cold starts

**Solutions:**

1. **Upgrade Render Plan**
   - Paid plans have faster cold starts
   - Better for production

2. **Keep Service Warm**
   - Use a cron job to ping your API every 10 minutes
   - Prevents cold starts
   - Free service: https://cron-job.org

3. **Use Async Email Queue**
   - Send emails in background
   - Return response immediately
   - Implement with Bull + Redis (advanced)

---

## Security Improvements for Production

### Before Going Live:

1. **Change JWT Secret**
   ```env
   JWT_SECRET=use-a-long-random-string-here-at-least-32-characters
   ```

2. **Add Rate Limiting**
   - Install: `npm install express-rate-limit`
   - Limit forgot-password to 3 requests per 15 minutes

3. **Add CAPTCHA**
   - Implement Google reCAPTCHA v3
   - Prevent automated abuse

4. **Hash OTP**
   - Currently stored in plain text
   - Should be hashed before storage

5. **Use HTTPS Only**
   - Render provides this automatically
   - Ensure FRONTEND_URL uses https://

---

## Monitoring

### Set Up Alerts

1. **Render Alerts**
   - Go to service settings
   - Enable email alerts for failures

2. **Email Delivery Monitoring**
   - Check Resend dashboard for delivery stats
   - Monitor bounce rates
   - Track open rates

3. **Error Logging**
   - Use a service like Sentry
   - Track 500 errors
   - Get notified of issues

---

## Cost Estimation

### Resend Pricing
- **Free:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Scale:** $80/month for 500,000 emails

### Render Pricing
- **Free:** Good for testing
- **Starter:** $7/month (recommended for production)
- **Standard:** $25/month (better performance)

### Total Monthly Cost
- **Development:** $0 (Free tiers)
- **Small Production:** $7 (Render Starter)
- **Growing Business:** $27 (Render Starter + Resend Pro)

---

## Troubleshooting Checklist

- [ ] Resend account created
- [ ] API key obtained
- [ ] Environment variables set on Render
- [ ] Service redeployed
- [ ] Health check passes
- [ ] Forgot password endpoint works
- [ ] Email received successfully
- [ ] Response time < 5 seconds
- [ ] No 500 errors in logs

---

## Quick Commands

### Test Production API

```bash
# Health check
curl https://digital-menu-be.onrender.com/api/health

# Forgot password
curl -X POST https://digital-menu-be.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check logs
# Go to Render dashboard → Logs
```

---

## Summary

**Problem:** Gmail SMTP doesn't work on Render (timeouts, blocks)

**Solution:** Switch to Resend (HTTP API, designed for cloud)

**Steps:**
1. Sign up for Resend
2. Get API key
3. Add to Render environment variables
4. Redeploy
5. Test

**Time:** 5 minutes

**Cost:** Free (3,000 emails/month)

---

## Next Steps

1. ✅ Sign up for Resend: https://resend.com
2. ✅ Get API key
3. ✅ Add environment variables to Render
4. ✅ Redeploy service
5. ✅ Test forgot password flow
6. ✅ Monitor logs for errors

---

**Need Help?**

Check Render logs for specific error messages and refer to this guide for solutions.

**Still Having Issues?**

1. Check Render logs
2. Verify all environment variables are set
3. Test with curl commands
4. Check Resend dashboard for delivery status

---

**Last Updated:** February 28, 2026  
**Status:** Production Fix Guide  
**Platform:** Render.com

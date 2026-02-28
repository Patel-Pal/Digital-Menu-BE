# 🚨 Production Issue - Quick Fix

## Problem
**500 Internal Server Error** on Render when sending emails

## Root Cause
Gmail SMTP doesn't work on Render (timeouts, network blocks)

---

## ⚡ Quick Fix (5 Minutes)

### 1. Sign Up for Resend
→ https://resend.com (Free account)

### 2. Get API Key
→ Dashboard → API Keys → Create

### 3. Add to Render Environment Variables

Go to: **Render Dashboard → Your Service → Environment**

Add these:
```
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=noreply@digitalmenu.com
FRONTEND_URL=https://your-frontend.vercel.app
```

### 4. Redeploy
Render auto-deploys when you save environment variables

### 5. Test
```bash
curl -X POST https://digital-menu-be.onrender.com/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

---

## Why This Fixes It

| Issue | Gmail SMTP | Resend API |
|-------|-----------|------------|
| **Works on Render** | ❌ No | ✅ Yes |
| **Fast** | ❌ Slow | ✅ Fast |
| **Reliable** | ❌ Timeouts | ✅ Stable |
| **Free Tier** | 500/day | 3,000/month |

---

## Alternative: Keep Gmail for Local, Resend for Production

### Local Development (.env)
```env
EMAIL_PROVIDER=nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=patelkenil0029@gmail.com
EMAIL_PASSWORD=vxkjlixiulfkvzbr
EMAIL_FROM=patelkenil0029@gmail.com
```

### Production (Render Environment Variables)
```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your_key
EMAIL_FROM=noreply@digitalmenu.com
```

---

## Verify It's Working

### Check Render Logs
1. Render Dashboard → Your Service → Logs
2. Look for: `Email sent successfully via Resend`
3. Should see message ID

### Test Endpoint
```bash
curl https://digital-menu-be.onrender.com/api/health
```

Should return:
```json
{"status":"OK","message":"Digital Menu API is running"}
```

---

## Still Not Working?

### Check These:

1. **Environment Variables Set?**
   - Go to Render → Environment
   - Verify EMAIL_PROVIDER=resend
   - Verify RESEND_API_KEY is set

2. **Service Redeployed?**
   - Render → Manual Deploy
   - Or wait for auto-deploy

3. **API Key Valid?**
   - Check Resend dashboard
   - Regenerate if needed

4. **Check Logs**
   - Render → Logs
   - Look for error messages

---

## Cost

**Resend Free Tier:**
- 3,000 emails/month
- Perfect for small apps
- No credit card required

**When to Upgrade:**
- 10,000+ users
- $20/month for 50,000 emails

---

## Summary

✅ **Problem:** Gmail SMTP fails on Render  
✅ **Solution:** Use Resend API instead  
✅ **Time:** 5 minutes  
✅ **Cost:** Free (3,000/month)  

**Action:** Sign up at https://resend.com and add API key to Render

---

**Need detailed guide?** See [RENDER_DEPLOYMENT_FIX.md](./RENDER_DEPLOYMENT_FIX.md)

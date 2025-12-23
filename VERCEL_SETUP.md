# 🚀 Vercel Deployment Setup Instructions

## Problem on Vercel

Your site works on localhost but fails on Vercel because:
1. **Environment variables are missing** on Vercel
2. **Database configuration** is different for production
3. **Latest code might not be deployed** yet

---

## ✅ Step-by-Step Fix

### Step 1: Set Environment Variables on Vercel

Go to your Vercel dashboard:
**https://vercel.com/rabie1995/tvtvforall/settings/environment-variables**

Add these variables (click "Add New"):

```
ADMIN_USERNAME=admin1995
ADMIN_PASSWORD=ssimo2003200459
DATABASE_URL=file:./prod.db
NEXT_PUBLIC_APP_URL=https://tvforall.store
SITE_URL=https://tvforall.store
SUPPORT_EMAIL=support@tvforall.store
SUPPORT_TELEGRAM=https://t.me/myiptv99
```

**Important:** Set all variables for "Production", "Preview", and "Development" environments.

---

### Step 2: Redeploy from GitHub

After adding environment variables:

1. Go to: **https://vercel.com/rabie1995/tvtvforall/deployments**
2. Click the latest deployment
3. Click the **"..." menu** (three dots)
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** is OFF
6. Click **"Redeploy"**

This forces Vercel to rebuild with new environment variables.

---

### Step 3: Verify Deployment

Once deployment completes:

1. **Check Admin Panel:**
   - Open: `https://tvforall.store/06620376830610209229`
   - Should load without redirect loop

2. **Test Checkout:**
   - Open: `https://tvforall.store/checkout?plan=plan_3m`
   - Fill form and submit
   - Should redirect to: `https://nowpayments.io/payment/?iid=6334134208`

---

## Common Issues & Fixes

### Issue: "500 Internal Server Error"
**Cause:** Environment variables not set
**Fix:** Complete Step 1 above, then redeploy

### Issue: "Admin panel redirects infinitely"
**Cause:** Old code cached or deployment failed
**Fix:** Force redeploy without cache (Step 2)

### Issue: "Checkout shows 'Payment provider not configured'"
**Cause:** Code not using static invoice links
**Fix:** Verify latest commit is deployed (should be: `0b16d6a`)

---

## Verify Latest Code is Deployed

Check your Vercel deployment logs:

1. Go to: **https://vercel.com/rabie1995/tvtvforall/deployments**
2. Click latest deployment
3. Check **"Source"** shows: `0b16d6a` or `Use static NOWPayments invoice links`
4. Check **"Status"** shows: `Ready`

If not, push code again:
```bash
git push origin main
```

---

## Database Notes

**Important:** Vercel uses ephemeral filesystem for SQLite:
- Database resets on each deployment
- Orders will be lost between deploys

**For production, you should:**
1. Use **Vercel Postgres** (recommended)
2. Or use **PlanetScale** / **Supabase**
3. Or use **Turso** (serverless SQLite)

For now, SQLite works for testing but data won't persist.

---

## Test Checklist

After deployment completes:

- [ ] Homepage loads: `https://tvforall.store`
- [ ] Pricing buttons work (redirect to checkout)
- [ ] Checkout form loads: `https://tvforall.store/checkout?plan=plan_3m`
- [ ] Checkout submission redirects to NOWPayments
- [ ] Admin panel loads: `https://tvforall.store/06620376830610209229`
- [ ] Admin shows orders (even if empty)

---

## If Still Not Working

**Check Vercel Function Logs:**

1. Go to: **https://vercel.com/rabie1995/tvtvforall/logs**
2. Select "Functions" tab
3. Look for errors in `/api/checkout`
4. Share the error message if you see one

**Force Clear Vercel Cache:**

```bash
# In your terminal (local)
npm install -g vercel
vercel --prod --force
```

---

## Need Help?

If issues persist after following all steps:

1. Screenshot the Vercel deployment logs
2. Screenshot the browser console errors (F12 → Console)
3. Share which specific error you're seeing

The code works locally, so the issue is 100% environment/deployment related, not code.

#!/bin/bash

# Force Vercel to redeploy with fresh build
# Run this after setting environment variables

echo "🔄 Forcing Vercel redeploy..."
echo ""
echo "Latest commit:"
git log --oneline -1
echo ""
echo "Triggering redeployment..."

# Create a dummy file to force new commit hash
echo "# Deployment trigger - $(date)" > .vercel-deploy-trigger
git add .vercel-deploy-trigger
git commit -m "Force Vercel redeploy - $(date +%Y%m%d-%H%M%S)"
git push origin main

echo ""
echo "✅ Pushed new commit to trigger Vercel deployment"
echo ""
echo "📋 Next steps:"
echo "1. Go to: https://vercel.com/rabie1995/tvtvforall/deployments"
echo "2. Wait for deployment to complete (~2 minutes)"
echo "3. Check the deployment log shows latest commit"
echo "4. Test: https://tvforall.store/checkout?plan=plan_3m"
echo ""
echo "⚠️  If still showing old error, click 'Redeploy' button on Vercel"
echo "   and UNCHECK 'Use existing Build Cache'"

# 🚀 Quick Fix: Deploy Now

## Fastest Solution - Use Your Existing Database

### Step 1: Update render.yaml
```bash
# Copy this command and run it:
cat > render.yaml << 'EOF'
services:
  - type: web
    name: real-estate-tracker
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: RENTCAST_API_KEY
        sync: false
      - key: DATABASE_URL
        sync: false
    healthCheckPath: /health
EOF
```

### Step 2: Commit and Push
```bash
git add render.yaml
git commit -m "fix: use existing database for deployment"
git push origin main
```

### Step 3: Deploy on Render
1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"** (NOT Blueprint)
3. Select your repo: `BitCodeHub/real-estate-tracker`
4. Click **"Create Web Service"**

### Step 4: Add Environment Variables
In the Render dashboard, add these environment variables:

1. **RENTCAST_API_KEY**: `your_rentcast_api_key_here`

2. **DATABASE_URL**: 
   - Option A: Use your existing Render database URL
   - Option B: Create free database at [neon.tech](https://neon.tech) and use that URL
   - Option C: Skip database (app will show error but still work for demo)

### That's it! 🎉
Your app will be live in 2-3 minutes at: `https://real-estate-tracker.onrender.com`

---

## Alternative: Deploy Without Database (Demo Only)

If you just want to demo the app without database:

```bash
# This will let you demo the app but properties won't persist
echo "DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy" > .env.production
git add .env.production
git commit -m "add: dummy database URL for demo"
git push origin main
```

Then deploy normally. The app will work but won't save properties.
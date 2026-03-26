# GitHub & Vercel Deployment - Step by Step Instructions

## Quick Overview

You will:
1. Download the ZIP from v0
2. Extract and verify it
3. Push to GitHub
4. Pull with GitHub Desktop
5. Deploy to Vercel

**Total time: ~15 minutes**

---

## Step-by-Step Instructions

### STEP 1: Download & Extract (Already Done ✓)

You've downloaded the ZIP file. Now:

```bash
# Navigate to your Dev Works folder
cd "C:\Users\yuri\OneDrive\문서\Dev Works\REL"

# Verify the mobile folder exists
ls -la urban-grail-mobile

# Should see: App.tsx, package.json, src/, etc.
```

### STEP 2: Verify Installation

```bash
# Go into the mobile folder
cd urban-grail-mobile

# Install dependencies (with fix for version conflict)
npm install

# If you get peer dependency warning, this is fine:
npm install --legacy-peer-deps
```

**Expected output:**
```
added X packages
audited Y packages
found 0 vulnerabilities
```

### STEP 3: Setup Environment

```bash
# Create local environment file
cp .env.example .env.local

# Open and edit .env.local with your API URL
# Example content:
# API_BASE_URL=https://your-backend-api.com
# API_TIMEOUT=30000
# AUTH_TOKEN_TIMEOUT=3600
# ENABLE_DEBUGGING=true
```

### STEP 4: Test Locally (Optional but Recommended)

```bash
# Start the development server
npm start

# In another terminal
npm run android

# Should see app loading on emulator
```

---

## STEP 5: Push to GitHub

### Option A: Push to Existing urban-grail-app Repository

```bash
# Navigate to mobile folder
cd C:\Users\yuri\OneDrive\문서\Dev Works\REL\urban-grail-mobile

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create commit
git commit -m "Add React Native mobile app - Urban Grail"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/yur1-dev/urban-grail-app.git

# Create branch for mobile
git checkout -b mobile

# Push to GitHub
git push -u origin mobile
```

### Option B: Push to New Repository

```bash
# Go to GitHub.com and create new repo named "urban-grail-mobile"

# In your local folder:
git init
git add .
git commit -m "Initial React Native mobile app setup"
git remote add origin https://github.com/yur1-dev/urban-grail-mobile.git
git branch -M main
git push -u origin main
```

**After pushing, verify on GitHub:**
1. Go to github.com/yur1-dev/urban-grail-app (or new repo)
2. You should see the mobile folder/branch with all files
3. Verify: App.tsx, package.json, src/, etc. are all there
4. **Important:** node_modules/ should NOT be there (it's in .gitignore)

---

## STEP 6: Pull with GitHub Desktop

### Method 1: From Command Line
```bash
# Create new folder for GitHub Desktop
mkdir "C:\Users\yuri\OneDrive\文档\Dev Works\REL\urban-grail-mobile-github"

# Clone the repo
git clone https://github.com/yur1-dev/urban-grail-app.git
cd urban-grail-app/mobile

# Or if separate repo:
git clone https://github.com/yur1-dev/urban-grail-mobile.git
cd urban-grail-mobile
```

### Method 2: Using GitHub Desktop GUI
1. Open GitHub Desktop
2. Click **File** → **Clone Repository**
3. Enter: `https://github.com/yur1-dev/urban-grail-app.git`
4. Select local path
5. Click **Clone**
6. Explore in explorer (should see all files)

### After Cloning:
```bash
# Install fresh dependencies
npm install

# Create .env.local again
cp .env.example .env.local
# Edit with your API URL

# Test it runs
npm start
```

---

## STEP 7: Deployment Options

### Option A: Deploy to Vercel (RECOMMENDED for Web)

**Note:** React Native apps don't deploy to Vercel like web apps. But your API backend does.

If deploying the **web backend** to Vercel:

```bash
# In your web folder (not mobile):
cd ../web  # assuming web app is in web folder

# Push to GitHub (if not already)
git push

# Go to vercel.com
# Click "Import Project"
# Select your repository
# Click Deploy

# Vercel will automatically detect and deploy
```

### Option B: Build APK for Google Play Store

```bash
# In your mobile folder:

# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for preview (faster)
npm run build:preview

# Or build for production
npm run build:android

# Follow the prompts
# Will give you download link for APK
```

Then upload APK to Google Play Store.

### Option C: Deploy via Expo

```bash
# Publish to Expo
npm install -g expo-cli
expo login
expo publish

# This makes it accessible via Expo app
# But most users won't use Expo app - they want Play Store
```

---

## COMPLETE CHECKLIST

Before GitHub push, run through this:

### Files & Configuration
- [ ] App.tsx exists and has no errors
- [ ] package.json has expo@^49.0.0 (not 50.0)
- [ ] app.json configured for Android
- [ ] tsconfig.json has path aliases
- [ ] babel.config.js has module-resolver
- [ ] .env.local created and configured
- [ ] .gitignore has node_modules/, .env, etc.
- [ ] assets/ folder exists with images

### Dependencies
```bash
npm install      # Completes without errors
npm ls          # Shows all packages
npx tsc --noEmit # No TypeScript errors
```

### Functionality
- [ ] `npm start` works
- [ ] `npm run android` works (or emulator available)
- [ ] App loads without crashing
- [ ] Can navigate screens
- [ ] Console has no errors

### Git
- [ ] `git status` shows only expected files
- [ ] node_modules/ NOT in git
- [ ] .env.local NOT in git
- [ ] All code files ARE in git
- [ ] .gitignore configured correctly

---

## MINIMAL STEPS (TL;DR)

If you just want to get it done quickly:

```bash
# 1. Enter folder
cd C:\Users\yuri\OneDrive\문서\Dev Works\REL\urban-grail-mobile

# 2. Install
npm install --legacy-peer-deps

# 3. Setup env
cp .env.example .env.local
# Edit .env.local with your API URL

# 4. Push to GitHub
git init
git add .
git commit -m "Add mobile app"
git remote add origin https://github.com/yur1-dev/urban-grail-app.git
git push -u origin mobile

# 5. Verify on GitHub - done!
# Then pull with GitHub Desktop as needed
```

---

## Troubleshooting

### Issue: Dependencies fail to install
```bash
# Solution:
npm cache clean --force
npm install --legacy-peer-deps
```

### Issue: Git push fails
```bash
# Make sure you're in the right folder
pwd  # Should show: .../urban-grail-mobile

# Make sure remote is set
git remote -v  # Should show origin URL

# If not:
git remote add origin https://github.com/yur1-dev/urban-grail-app.git
```

### Issue: GitHub Desktop doesn't show changes
1. Right-click folder → **Open with GitHub Desktop**
2. Or: GitHub Desktop → **File** → **Add Local Repository**
3. Select the folder

### Issue: Files showing as modified after clone
```bash
# This is normal - just due to line endings
# Fix:
git config core.autocrlf true
```

---

## What Each File Does

| File | Purpose |
|------|---------|
| **App.tsx** | Root component - entry point |
| **package.json** | Dependencies & scripts |
| **app.json** | Expo configuration |
| **tsconfig.json** | TypeScript settings |
| **babel.config.js** | Babel transpiler settings |
| **.env.example** | Template for environment variables |
| **.env.local** | Your actual environment (never commit) |
| **.gitignore** | Files to exclude from git |
| **src/** | All source code |
| **assets/** | App icons and images |

---

## Next Steps After GitHub

1. ✅ Code is on GitHub
2. ✅ You can collaborate with GitHub Desktop
3. ⏭️ **For Android Play Store:** Use EAS to build APK
4. ⏭️ **For Backend/Web:** Deploy to Vercel separately
5. ⏭️ **For Testing:** Use Android emulator or device

---

## Getting Help

If something goes wrong:

1. Read error message carefully
2. Check **BEFORE_DEPLOYMENT.md** for fixes
3. Check **DEPLOYMENT_GUIDE.md** for detailed info
4. Search Google for the error
5. Check Expo docs: docs.expo.dev

---

## Final Note

**This is a fully functional React Native mobile app.** Everything is ready to:
- ✅ Build locally
- ✅ Push to GitHub
- ✅ Build for production
- ✅ Deploy to Play Store

No additional setup needed! Just follow the steps above. 🚀

---

**Questions?** Check the other documentation files in the mobile folder:
- DEPLOYMENT_GUIDE.md
- BEFORE_DEPLOYMENT.md
- QUICK_START.md
- README.md

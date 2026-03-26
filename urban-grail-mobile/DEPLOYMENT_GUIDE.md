# React Native Mobile App - Complete Deployment Guide

## Overview
This guide will walk you through setting up the Urban Grail mobile app and deploying it to Google Play Store.

---

## Phase 1: Local Development Setup

### Step 1: Prerequisites
Before starting, ensure you have installed:
- **Node.js** v18+ ([download](https://nodejs.org))
- **npm** v9+ (comes with Node.js)
- **Git** ([download](https://git-scm.com))
- **Android Studio** (for Android development)
  - Android SDK API 31+
  - Android Virtual Device (AVD) or physical device

Verify installations:
```bash
node --version      # Should be v18+
npm --version       # Should be v9+
git --version       # Any recent version
```

### Step 2: Clone & Install

```bash
# Navigate to your projects folder
cd "path/to/your/projects"

# Clone the repository
git clone https://github.com/yourusername/urban-grail-app.git
cd urban-grail-app/mobile  # or wherever you placed the mobile folder

# Install dependencies
npm install

# If you get peer dependency errors, use:
npm install --legacy-peer-deps
```

### Step 3: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your API configuration
# Important: Update API_BASE_URL to your actual backend
```

**Example .env.local:**
```
API_BASE_URL=https://your-api.com
API_TIMEOUT=30000
AUTH_TOKEN_TIMEOUT=3600
ENABLE_DEBUGGING=true
```

### Step 4: Create Assets Folder

The app requires icon and splash screen images. Create the folder and add files:

```bash
mkdir -p assets
```

Add these files to the `assets/` folder:
- `icon.png` (1024x1024 px) - App icon
- `splash.png` (1242x2436 px) - Splash screen
- `adaptive-icon.png` (1024x1024 px) - Android adaptive icon
- `favicon.png` (192x192 px) - Web favicon

**Quick placeholder generation:**
```bash
# If you have ImageMagick installed:
convert -size 1024x1024 xc:#4A90E2 assets/icon.png
convert -size 1242x2436 xc:#ffffff assets/splash.png
convert -size 1024x1024 xc:#4A90E2 assets/adaptive-icon.png
convert -size 192x192 xc:#4A90E2 assets/favicon.png
```

Or use online tools like:
- [Ezgif.com](https://ezgif.com) - Image resizing
- [Favicon Generator](https://www.favicon-generator.org) - Icon generation

### Step 5: Run on Android

```bash
# Start Expo dev server
npm start

# In another terminal, run Android
npm run android

# Or if using Android Emulator:
npm start --android
```

You should see:
1. Metro bundler starting
2. Android emulator loading
3. App launching on device/emulator

---

## Phase 2: GitHub Setup & Push

### Step 1: Prepare for GitHub

```bash
# Navigate to your mobile directory
cd path/to/urban-grail-mobile

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial React Native mobile app setup"
```

### Step 2: Push to GitHub

**Option A: If you have an existing urban-grail-app repo:**

```bash
# Add the existing repo as remote
git remote add origin https://github.com/yourusername/urban-grail-app.git

# Pull any existing changes
git pull origin main

# Create a new branch for mobile
git checkout -b mobile/initial-setup

# Push the branch
git push -u origin mobile/initial-setup
```

**Option B: If creating a new repo:**

1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository named `urban-grail-mobile`
3. Copy the repo URL
4. In your terminal:

```bash
git remote add origin https://github.com/yourusername/urban-grail-mobile.git
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

1. Go to your GitHub repository
2. Verify all files are there:
   - `App.tsx`
   - `package.json`
   - `app.json`
   - `src/` folder with all subdirectories
   - Documentation files
3. Check that `node_modules/` is NOT included (should be in .gitignore)

---

## Phase 3: Pull with GitHub Desktop

### Step 1: Open GitHub Desktop

1. Launch **GitHub Desktop**
2. Go to **File** → **Clone Repository**
3. Select **URL** tab
4. Paste your repo URL
5. Choose local path
6. Click **Clone**

### Step 2: Verify Files

After cloning:
```bash
# Open terminal in the cloned folder
cd path/to/cloned/urban-grail-mobile

# Install dependencies (fresh install from GitHub)
npm install
```

### Step 3: Create .env.local

```bash
# Copy example env
cp .env.example .env.local

# Edit with your API configuration
# (Do NOT commit .env.local to GitHub)
```

---

## Phase 4: Build for Production

### Step 1: Install EAS CLI

```bash
# Install EAS (Expo Application Services)
npm install -g eas-cli

# Login to Expo
eas login
# Enter your Expo credentials (create account at expo.io if needed)
```

### Step 2: Configure EAS Build

```bash
# Initialize EAS in your project
eas build:configure
# Select Android when prompted
```

This creates `eas.json` file.

### Step 3: Build Android APK

```bash
# Build for preview (faster, just APK)
npm run build:preview

# Or build for production (optimized)
npm run build:android
```

**What to expect:**
- Upload to Expo servers
- Build process takes 10-20 minutes
- Shows progress in terminal
- Provides download link when complete

### Step 4: Test the APK

Download the APK and install on Android device:
```bash
# Download from the link provided
adb install app-production.apk
# Or transfer and install manually
```

---

## Phase 5: Google Play Store Deployment

### Step 1: Create Google Play Developer Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 registration fee
3. Complete account setup with:
   - Name, address, payment info
   - Business details
   - Accept agreements

### Step 2: Create App

1. In Google Play Console, click **Create app**
2. Fill in:
   - App name: "Urban Grail"
   - Default language: English
   - App category: Shopping
   - Declarations: Mark as required
3. Accept the Google Play Developer Agreement
4. Click **Create app**

### Step 3: Prepare Release

1. **App content**
   - Add description
   - Add screenshots (5-8 images)
   - Add app icon (512x512 px)
   - Add feature graphic (1024x500 px)

2. **Content rating**
   - Fill out questionnaire
   - Submit for rating

3. **Target audience**
   - Select appropriate ratings

### Step 4: Build Signed APK/AAB

```bash
# Create a keystore (one-time)
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias

# Follow prompts to set password and key info
```

**Alternative: Use EAS for signed builds**

```bash
# Update eas.json with production config
npm run build:android
# Select "production" profile
# EAS handles signing automatically
```

### Step 5: Upload to Play Store

1. In Google Play Console, go to **Release** → **Production**
2. Click **Create new release**
3. Upload the signed APK/AAB:
   - Either drag-and-drop the file
   - Or select from file browser
4. Set version name and release notes
5. Review for any issues
6. Click **Review release**
7. Click **Start rollout to production**

### Step 6: Monitor Deployment

- Takes 2-3 hours for app to go live
- Check progress in Google Play Console
- App becomes searchable in Play Store within 24 hours

---

## Verification Checklist

### Before Building:
- [ ] `.env.local` is configured
- [ ] All dependencies installed (`npm install`)
- [ ] App runs locally (`npm run android`)
- [ ] No console errors or warnings
- [ ] All screens navigating correctly
- [ ] API calls working

### Before Production Build:
- [ ] Git repository updated
- [ ] No uncommitted changes
- [ ] `node_modules/` in `.gitignore`
- [ ] `.env.local` NOT in git
- [ ] All assets (icons, splash) added
- [ ] Version number updated in `app.json`

### Before Play Store:
- [ ] APK/AAB signed correctly
- [ ] All screenshots prepared
- [ ] App description complete
- [ ] Pricing set ($0 for free)
- [ ] Content rating submitted
- [ ] Terms of Service added

---

## Common Issues & Solutions

### Issue: `npm install` fails
```bash
# Solution 1: Clear cache
npm cache clean --force
npm install

# Solution 2: Use legacy peer deps
npm install --legacy-peer-deps

# Solution 3: Delete node_modules and lock file
rm -rf node_modules package-lock.json
npm install
```

### Issue: App won't start on Android
```bash
# Clear cache and rebuild
npm start --clear
npm run android

# Or kill all processes and restart
# Then try again
```

### Issue: API calls failing
- Check `.env.local` has correct API_BASE_URL
- Ensure API is accessible from your machine
- Check API accepts CORS requests
- Verify network connectivity

### Issue: Build fails on EAS
- Check `eas.json` is configured correctly
- Ensure you're logged in: `eas whoami`
- Check build logs in Expo dashboard
- Try: `eas build --platform android --profile preview` first

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| API_BASE_URL | Backend API URL | https://api.yoursite.com |
| API_TIMEOUT | Request timeout in ms | 30000 |
| AUTH_TOKEN_TIMEOUT | Session timeout in seconds | 3600 |
| ENABLE_DEBUGGING | Enable console logs | true/false |

---

## File Structure Reference

```
urban-grail-mobile/
├── App.tsx                 # Root component
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── babel.config.js        # Babel config
├── .env.example           # Environment template
├── .env.local             # Local environment (NOT in git)
├── .gitignore             # Git ignore rules
├── assets/                # App icons and splash
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
├── src/
│   ├── api/              # API client and endpoints
│   ├── store/            # Zustand stores
│   ├── hooks/            # Custom hooks
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation configuration
│   ├── components/       # Reusable components
│   ├── types/            # TypeScript types
│   ├── theme/            # Theme configuration
│   └── utils/            # Utility functions
├── README.md
├── SETUP_GUIDE.md
├── QUICK_START.md
└── eas.json              # EAS build configuration

```

---

## Next Steps

1. ✅ Follow Phase 1 - Local setup
2. ✅ Follow Phase 2 - GitHub setup
3. ✅ Pull with GitHub Desktop (Phase 3)
4. ⏭️ Test thoroughly before building
5. ⏭️ Build for production (Phase 4)
6. ⏭️ Deploy to Play Store (Phase 5)

---

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Google Play Console**: https://play.google.com/console
- **Android Studio**: https://developer.android.com/studio
- **Babel Config**: https://babeljs.io/docs/config-files

---

## Quick Reference Commands

```bash
# Development
npm start                    # Start Expo server
npm run android             # Run on Android
npm test                    # Run tests

# Production Build
npm run build:preview       # Build preview APK
npm run build:android       # Build production

# Git
git status                  # Check git status
git add .                   # Stage changes
git commit -m "message"     # Commit
git push                    # Push to GitHub
git pull                    # Pull from GitHub

# Utilities
eas login                   # Login to Expo
eas build:configure        # Configure EAS build
npm cache clean --force    # Clear npm cache
```

---

Good luck with your deployment! 🚀

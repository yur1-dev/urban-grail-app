# Pre-Deployment Error Checking Checklist

## Complete Error-Free Verification Guide

Run through this entire checklist BEFORE pushing to GitHub to ensure zero issues.

---

## 1. Dependencies Verification

### Step 1: Install and Check
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Should complete without errors
# If errors occur, see Troubleshooting below
```

### Step 2: Verify All Packages
```bash
npm ls

# Should show no errors or conflicts
# All packages should have versions listed
```

### Expected Dependencies:
```
✓ react@^18.2.0
✓ react-native@0.73.6
✓ expo@^49.0.0
✓ expo-router@^2.0.0
✓ @react-navigation/native@^6.1.9
✓ react-native-paper@^5.11.1
✓ zustand@^4.4.1
✓ axios@^1.6.2
✓ expo-secure-store@^12.3.1
```

---

## 2. Configuration Files Verification

### Check App.json
```bash
# Validate JSON syntax
node -e "const f = require('./app.json'); console.log('✓ app.json valid')"
```

**Required fields:**
- ✓ expo.name: "Urban Grail"
- ✓ expo.slug: "urban-grail-mobile"
- ✓ expo.version: "1.0.0"
- ✓ expo.android.package: "com.urbangrail.mobile"
- ✓ expo.plugins includes secure-store

### Check package.json
```bash
# Validate JSON syntax
node -e "const f = require('./package.json'); console.log('✓ package.json valid')"
```

**Required fields:**
- ✓ name: "urban-grail-mobile"
- ✓ version: "1.0.0"
- ✓ expo@^49.0.0 (not 50.0)
- ✓ babel-plugin-module-resolver in devDependencies

### Check tsconfig.json
```bash
# Verify TypeScript config
npx tsc --noEmit

# Should show no errors
```

**Required:**
- ✓ extends: "expo/tsconfig"
- ✓ baseUrl: "."
- ✓ All path aliases (@screens, @api, etc.)

### Check babel.config.js
```bash
# Babel will be tested during build
# Just verify it exists and has:
```

**Required:**
- ✓ babel-preset-expo preset
- ✓ module-resolver plugin
- ✓ react-native-dotenv plugin
- ✓ All path aliases defined

---

## 3. Environment Configuration

### Create .env.local
```bash
cp .env.example .env.local
cat .env.local
```

**Required in .env.local:**
```
API_BASE_URL=https://your-api-url.com
API_TIMEOUT=30000
AUTH_TOKEN_TIMEOUT=3600
ENABLE_DEBUGGING=true
```

**✓ Verify:**
- [ ] .env.local exists
- [ ] .env.local is NOT in git (check .gitignore)
- [ ] API_BASE_URL points to your backend
- [ ] All variables have values

---

## 4. File Structure Verification

### Required Directories
```bash
# Check all required folders exist
ls -la src/                    # Should exist
ls -la src/api/               # Should have api files
ls -la src/store/             # Should have store files
ls -la src/screens/           # Should have screen files
ls -la src/navigation/        # Should have navigation
ls -la src/components/        # Should have components
ls -la src/types/             # Should have types
ls -la src/theme/             # Should have theme
ls -la src/utils/             # Should have utilities
ls -la src/hooks/             # Should have hooks
```

### Required Root Files
```bash
# All these should exist
ls -la App.tsx                # Root component
ls -la app.json              # Expo config
ls -la package.json          # Dependencies
ls -la tsconfig.json         # TypeScript config
ls -la babel.config.js       # Babel config
ls -la .env.example          # Environment template
ls -la .gitignore            # Git rules
```

### Asset Files
```bash
# These should exist (create if missing)
ls -la assets/
# Should have: icon.png, splash.png, adaptive-icon.png, favicon.png
```

---

## 5. TypeScript Compilation Check

### Run Type Check
```bash
npx tsc --noEmit --skipLibCheck
```

**Expected output:**
```
✓ No errors detected
```

**If errors occur:**
- [ ] Check src/types/ for syntax errors
- [ ] Ensure all imports use correct paths (@screens, @api, etc.)
- [ ] Check for missing type definitions

---

## 6. Lint Check (Optional)

```bash
# If ESLint is configured
npm run lint

# Should show no critical errors
```

---

## 7. Start Test

### Test Local Development
```bash
# Start Expo
npm start

# In another terminal, test on Android
npm run android
```

**What should happen:**
1. Metro bundler starts
2. Shows QR code for mobile
3. App loads on emulator/device
4. You see the splash screen
5. App navigates to login screen (if not authenticated)

**If it fails:**
- [ ] Check error message in terminal
- [ ] Verify .env.local is set
- [ ] Check for TypeScript errors
- [ ] Clear cache: `npm start --clear`

---

## 8. Git Setup Verification

### Check .gitignore
```bash
# Should include:
cat .gitignore

# Must have:
# - node_modules/
# - .env
# - .env.local
# - dist/
# - build/
# - .DS_Store
```

### Check No Sensitive Files in Git
```bash
# Should be empty or show only expected files
git status

# Should NOT show:
# - node_modules/
# - .env.local
# - dist/
# - build/
```

---

## 9. API Connection Test

### Verify API Connectivity
```bash
# Quick test that API is reachable
curl -X GET https://your-api-url.com/api/health

# Or test in the app:
# 1. Run the app (npm run android)
# 2. Try to login
# 3. Check if API call succeeds
# 4. Check Network tab in console
```

---

## 10. Final Pre-Push Checklist

Before pushing to GitHub, verify:

### Code Quality
- [ ] No console.log() debug statements
- [ ] No hardcoded URLs (use .env)
- [ ] No TODO comments in critical code
- [ ] No unused imports
- [ ] All imports use correct paths (@screens, @api)

### Security
- [ ] No API keys in code
- [ ] No passwords in code
- [ ] .env.local is in .gitignore
- [ ] Tokens stored securely (using SecureStore)
- [ ] No sensitive info in git history

### Functionality
- [ ] App starts without errors
- [ ] Navigation working
- [ ] API calls working
- [ ] No runtime warnings

### Git
- [ ] All files staged
- [ ] Commit message is clear
- [ ] No node_modules/ in git
- [ ] .gitignore is correct

---

## Common Errors & Fixes

### Error: `Module not found: @screens/...`
**Fix:**
```bash
# Verify babel.config.js has module-resolver
# Verify tsconfig.json has path aliases
# Restart: npm start --clear
```

### Error: `ERESOLVE unable to resolve dependency tree`
**Fix:**
```bash
npm install --legacy-peer-deps
# Or
npm cache clean --force && npm install
```

### Error: `API_BASE_URL is undefined`
**Fix:**
```bash
# Create .env.local
cp .env.example .env.local

# Edit .env.local and add:
API_BASE_URL=https://your-api.com

# Restart app: npm start --clear
```

### Error: App crashes on startup
**Fix:**
1. Check terminal for error messages
2. Clear cache: `npm start --clear`
3. Clear Expo cache: `expo start --clear`
4. Check tsconfig.json for path issues
5. Verify all imports are correct

### Error: "Cannot find module 'babel-plugin-module-resolver'"
**Fix:**
```bash
# Install missing dependency
npm install --save-dev babel-plugin-module-resolver

# Then restart
npm start --clear
```

---

## Verification Summary

| Check | Command | Status |
|-------|---------|--------|
| Dependencies | `npm ls` | ✓ No conflicts |
| TypeScript | `npx tsc --noEmit` | ✓ No errors |
| JSON Configs | `node -e "require('./app.json')"` | ✓ Valid |
| Git Ignore | `git status` | ✓ Clean |
| Environment | `cat .env.local` | ✓ Configured |
| Local Run | `npm run android` | ✓ Starts |
| API Access | `curl API_BASE_URL` | ✓ Responds |

---

## Ready to Deploy?

Once all checks pass:

1. ✅ Push to GitHub
   ```bash
   git add .
   git commit -m "Urban Grail Mobile App - Initial Setup"
   git push origin main
   ```

2. ✅ Pull with GitHub Desktop

3. ✅ Verify again locally
   ```bash
   npm install
   npm run android
   ```

4. ✅ Proceed with deployment

**Everything should work smoothly!** 🚀

---

## Need Help?

If you encounter errors:

1. **Check the error message carefully** - It usually tells you what's wrong
2. **Google the error** - Chances are someone else encountered it
3. **Check GitHub Issues** - React Native and Expo have active communities
4. **Review DEPLOYMENT_GUIDE.md** - May have solution
5. **Check your API** - If API calls fail, verify backend is running

Good luck! 🎉

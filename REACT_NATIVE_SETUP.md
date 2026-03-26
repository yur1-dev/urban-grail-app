# React Native Mobile App - Complete Setup Guide

## Urban Grail Mobile (Android with Expo)

This guide provides step-by-step instructions to initialize and run your React Native Expo project.

---

## Prerequisites

Before starting, ensure you have:
- Node.js v18+ installed ([Download](https://nodejs.org/))
- npm or yarn package manager
- Expo CLI globally installed: `npm install -g expo-cli`
- Android Studio (for emulator) or physical Android device
- A GitHub account (for repository management)
- Vercel account (optional, for deployment)

---

## Step 1: Create the Expo Project

```bash
# Navigate to your projects directory
cd /path/to/your/projects

# Create new Expo project
npx create-expo-app urban-grail-mobile

# Navigate into the project
cd urban-grail-mobile

# Initialize git
git init
git add .
git commit -m "Initial commit: Create Expo project"
```

---

## Step 2: Install Core Dependencies

Run these commands in order:

### 2.1 Navigation Dependencies
```bash
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler react-native-reanimated
```

### 2.2 State Management
```bash
npm install zustand
```

### 2.3 UI Component Library
```bash
npm install react-native-paper
```

### 2.4 API & HTTP Client
```bash
npm install axios
```

### 2.5 Authentication & Storage
```bash
npx expo install expo-secure-store
npm install @react-native-async-storage/async-storage
```

### 2.6 Form Handling & Validation
```bash
npm install react-hook-form
npm install zod
```

### 2.7 Image Handling
```bash
npx expo install expo-image
```

### 2.8 Network & System Utilities
```bash
npx expo install expo-network
npx expo install expo-constants
```

### 2.9 Notifications (Optional)
```bash
npx expo install expo-notifications
```

### 2.10 Date Utilities
```bash
npm install date-fns
npm install -D @types/react-native
```

### 2.11 Environment Variables
```bash
npm install react-native-dotenv
npm install --save-dev babel-plugin-dotenv
```

---

## Step 3: Configure Babel for Environment Variables

Update `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-dotenv'],
  };
};
```

---

## Step 4: Project Folder Structure Setup

Create the following directory structure:

```bash
# Create all necessary folders
mkdir -p src/api src/store src/screens/auth src/screens/shop src/screens/cart src/screens/orders src/screens/account src/screens/splash
mkdir -p src/navigation src/components/common src/components/shop src/components/cart src/components/auth
mkdir -p src/hooks src/types src/utils src/theme assets/__tests__/{api,store,utils}
```

---

## Step 5: Environment Configuration

### 5.1 Create `.env.local` (DO NOT COMMIT)

Create file: `.env.local`

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
EXPO_PUBLIC_API_TIMEOUT=30000

# App Configuration
EXPO_PUBLIC_APP_NAME=Urban Grail Mobile
EXPO_PUBLIC_APP_VERSION=1.0.0

# Authentication
EXPO_PUBLIC_AUTH_TIMEOUT=3600000

# Feature Flags
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# Debug
EXPO_PUBLIC_DEBUG_MODE=false
```

### 5.2 Create `.env.example` (COMMIT THIS)

Create file: `.env.example`

```env
# API Configuration - Replace with your actual API domain
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain.com/api
EXPO_PUBLIC_API_TIMEOUT=30000

# App Configuration
EXPO_PUBLIC_APP_NAME=Urban Grail Mobile
EXPO_PUBLIC_APP_VERSION=1.0.0

# Authentication
EXPO_PUBLIC_AUTH_TIMEOUT=3600000

# Feature Flags
EXPO_PUBLIC_ENABLE_NOTIFICATIONS=true
EXPO_PUBLIC_ENABLE_ANALYTICS=false

# Debug
EXPO_PUBLIC_DEBUG_MODE=false
```

### 5.3 Update `.gitignore`

Add these lines to `.gitignore`:

```
# Environment variables
.env
.env.local
.env.*.local

# Build files
dist/
build/
.eas/

# IDE
.vscode/
.idea/
*.swp

# Node
node_modules/
.npm

# Expo
.expo/
.expo-shared/
```

---

## Step 6: Configure `app.json`

Replace the entire `app.json` with:

```json
{
  "expo": {
    "name": "Urban Grail",
    "slug": "urban-grail-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.urbangrail.mobile",
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE"
      ],
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store"
    ],
    "extra": {
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID_HERE"
      }
    }
  }
}
```

---

## Step 7: Create Essential Configuration Files

### 7.1 TypeScript Configuration

Create `tsconfig.json` if it doesn't exist:

```json
{
  "extends": "expo/tsconfig",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@screens/*": ["src/screens/*"],
      "@store/*": ["src/store/*"],
      "@api/*": ["src/api/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"],
      "@theme/*": ["src/theme/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

### 7.2 Update `package.json` Scripts

Update the scripts section:

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "test": "jest",
  "test:watch": "jest --watch",
  "build:android": "eas build --platform android",
  "build:preview": "eas build --platform android --profile preview",
  "lint": "eslint . --ext .ts,.tsx"
}
```

---

## Step 8: Verify Installation

Run this command to verify everything is set up:

```bash
npm list react-navigation react-native-paper zustand axios
```

You should see all packages listed without errors.

---

## Step 9: First Run

### 9.1 Start Development Server

```bash
npm start
```

### 9.2 Run on Android Emulator

Keep the above command running, then in a new terminal:

```bash
npm run android
```

### 9.3 Run on Physical Android Device

1. Connect device via USB with Developer Mode enabled
2. Run: `npm run android`

---

## Step 10: Troubleshooting

### Issue: "EXPO_PUBLIC_API_BASE_URL is undefined"
**Solution**: Ensure your `.env.local` file is in the project root and has the correct format. Restart the development server with `npm start -- -c`.

### Issue: "Module not found" errors
**Solution**: 
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm start -c
```

### Issue: Port 8081 already in use
**Solution**: 
```bash
# Change port
npm start -- --port 8090
```

### Issue: Android emulator not starting
**Solution**: 
```bash
# Start emulator manually first, then:
npm run android
```

---

## Next Steps

Once the project starts successfully:

1. Proceed to **Task 2: Environment Setup & Configuration**
2. Create the API client layer
3. Set up Zustand stores
4. Configure navigation
5. Build authentication screens

---

## Important Notes

- **NEVER commit `.env.local`** - Only commit `.env.example`
- **API_BASE_URL format**: Should be `https://your-domain.com/api` (without trailing slash)
- **Token storage**: Always use SecureStore for JWT tokens, never AsyncStorage
- **Hot reload**: Changes to JavaScript automatically reload, but `.env` changes require restart
- **Android package name**: `com.urbangrail.mobile` - customize if needed

---

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation Guide](https://reactnavigation.org/docs/getting-started)
- [React Native Paper Docs](https://callstack.github.io/react-native-paper/)
- [Zustand Docs](https://github.com/pmndrs/zustand)

---

**Last Updated**: March 2026
**Project**: Urban Grail Mobile
**Platform**: Android (with Expo)

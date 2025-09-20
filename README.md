# RNR Training Client Mobile App

A React Native mobile application for RNR Training clients to view their training plans and meal schedules. Built with the Bullish-inspired design system for a modern, dark-themed experience.

## Features

- **Auth0 Authentication**: Secure login using Auth0
- **Training Plans**: View assigned weekly training schedules with exercises, sets, reps, and notes
- **Meal Plans**: Browse daily meal plans with nutritional information and recipes
- **Account Management**: View and update personal profile information
- **Bullish Design System**: Modern dark theme with signature green accents
- **Responsive UI**: Optimized for mobile with smooth animations and interactions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

### Development

```bash
# Start the Expo development server
npm start

# Run on iOS Simulator
npm run ios

# Run on Android Emulator
npm run android

# Run in web browser
npm run web
```

## Configuration

The app connects to the backend API at `http://localhost:8081/api` by default. Update the configuration in `src/config/auth.ts` if your backend is running on a different URL.

### Auth0 Setup

The app uses Auth0 for authentication. The current configuration uses:
- Domain: `dev-ffuy7gqrimo4flu2.uk.auth0.com`
- Client ID: `oagA9k8icEHEZvRic9mQpQiiPlbydJTI`

## Project Structure

```
clients-mobile/
├── src/
│   ├── config/         # Configuration files
│   ├── contexts/       # React contexts (Auth)
│   ├── navigation/     # Navigation setup
│   ├── screens/        # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── TrainingPlansScreen.tsx
│   │   ├── MealPlansScreen.tsx
│   │   └── AccountScreen.tsx
│   └── services/       # API services
├── assets/            # Images and icons
├── App.tsx           # Main app component
└── package.json
```

## Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Run on Android emulator/device
- `npm run ios`: Run on iOS simulator/device
- `npm run web`: Run in web browser

## Building for Production

To create a production build:

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

Note: You'll need to set up an Expo account and configure EAS Build first.

## Troubleshooting

1. **Auth0 Login Issues**: Ensure the redirect URI is properly configured in your Auth0 application settings
2. **API Connection**: Verify the backend server is running and accessible at the configured URL
3. **Metro Bundler**: If you encounter bundler issues, try clearing the cache: `npx expo start -c`
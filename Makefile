.PHONY: help install start build-ios build-android build-all build-production clean test

# Default target
help:
	@echo "RNR Training Mobile App - Build Commands"
	@echo ""
	@echo "Development:"
	@echo "  make install          - Install dependencies"
	@echo "  make start           - Start Expo development server"
	@echo "  make ios             - Run on iOS simulator"
	@echo "  make android         - Run on Android emulator"
	@echo ""
	@echo "Build Commands:"
	@echo "  make build-ios       - Build iOS app"
	@echo "  make build-android   - Build Android app"
	@echo "  make build-all       - Build for all platforms"
	@echo "  make build-production - Build production versions for all platforms"
	@echo ""
	@echo "Preview Builds:"
	@echo "  make preview-ios     - Build iOS preview/staging version"
	@echo "  make preview-android - Build Android preview/staging version"
	@echo ""
	@echo "Deployment:"
	@echo "  make submit-ios      - Submit iOS build to App Store"
	@echo "  make submit-android  - Submit Android build to Play Store"
	@echo "  make update          - Deploy OTA update"
	@echo "  make update-production - Deploy OTA update to production"
	@echo ""
	@echo "Utilities:"
	@echo "  make prebuild        - Generate native projects"
	@echo "  make clean           - Clean build artifacts and caches"
	@echo "  make setup-eas       - Setup EAS Build (first time only)"

# Install dependencies
install:
	npm install

# Start development server
start:
	npm start

# Run on iOS simulator
ios:
	npm run ios

# Run on Android emulator
android:
	npm run android

# Build for iOS
build-ios:
	npm run build:ios

# Build for Android
build-android:
	npm run build:android

# Build for all platforms
build-all:
	npm run build:all

# Build production versions for all platforms
build-production:
	npm run build:ios:production
	npm run build:android:production

# Build preview/staging versions
preview-ios:
	npm run build:ios:preview

preview-android:
	npm run build:android:preview

# Submit to app stores
submit-ios:
	npm run submit:ios

submit-android:
	npm run submit:android

# Deploy OTA updates
update:
	npm run update

update-production:
	npm run update:production

update-preview:
	npm run update:preview

# Generate native projects
prebuild:
	npm run prebuild

# Clean build artifacts and caches
clean:
	npm run prebuild:clean
	rm -rf node_modules
	rm -rf ios/build
	rm -rf android/build
	rm -rf android/app/build
	rm -rf .expo
	npm cache clean --force

# Setup EAS Build (run once for new projects)
setup-eas:
	npm install -g eas-cli
	eas build:configure

# Check EAS build status
build-status:
	eas build:list --limit=5

# Run locally with production environment
start-production:
	NODE_ENV=production expo start --no-dev

# Build and run iOS production locally
ios-production:
	NODE_ENV=production expo run:ios --configuration Release

# Build and run Android production locally
android-production:
	NODE_ENV=production expo run:android --variant release
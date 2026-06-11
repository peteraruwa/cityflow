## Android Build Setup (DO NOT CHANGE THESE SETTINGS)

### Prerequisites
- JDK 17
- Android Studio with SDK and NDK 28.2.13676358
- Node.js 20 LTS

### Critical Configuration Files (DO NOT MODIFY)
- `android/gradle.properties` - Gradle settings
- `android/app/build.gradle` - App signing and NDK version
- `android/build.gradle` - Root project NDK version

### Build Commands
```bash
# Clean build
cd android
./gradlew clean
./gradlew assembleRelease

# The APK will be at: android/app/build/outputs/apk/release/app-release.apk
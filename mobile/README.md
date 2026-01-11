# LifeSync Mobile App

The mobile companion for the LifeSync healthcare ecosystem, built with React Native and Expo.

## 📱 Features
- **Doctor Discovery**: Search and filter doctors by specialty.
- **Appointment Management**: Book and view appointments on the go.
- **Dark Mode**: Fully supports system-wide dark mode for a premium experience.
- **Push Notifications**: Receive reminders and status updates.

## 🛠️ Tech Stack
- **React Native** (v0.81.x)
- **Expo** (v54.x)
- **Expo Router** (File-based navigation)
- **NativeWind** (Tailwind CSS for Mobile)

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run the App**
   ```bash
   npx expo start
   ```

3. **Open on Device**
   - Download the **Expo Go** app on your phone.
   - Scan the QR code displayed in your terminal.

---

> **Note**: For detailed configuration of the mobile environment and production SSO setup, please refer to:
> - **[Mobile Setup Guide](../MOBILE_SETUP.md)**: Detailed Expo setup and local testing.
> - **[Google SSO Setup](../GOOGLE_SSO_SETUP.md)**: Production OAuth configuration.
> - **[Apple SSO Setup](../APPLE_SSO_SETUP.md)**: Production Sign-In configuration.

## 📁 Structure
- `/app`: Main application screens using Expo Router.
- `/components`: Reusable UI components.
- `/context`: Application global state management.
- `/hooks`: Custom React hooks for API calls and logic.

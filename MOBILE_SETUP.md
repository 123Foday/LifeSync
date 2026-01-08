# Mobile App Setup & Testing Guide

This guide describes how to run, test, and debug the LifeSync mobile application using Expo.

## Prerequisites

1.  **Node.js**: Ensure Node.js is installed.
2.  **Expo Go App**:
    *   **Android**: Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store.
    *   **iOS**: Install [Expo Go](https://apps.apple.com/us/app/expo-go/id982107779) from App Store.
3.  **Backends**: Ensure your Backend and Admin/Frontend services are running properly, as the mobile app connects to them.

## Setup Instructions

1.  **Navigate to Mobile Directory**:
    ```bash
    cd mobile
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    *   The app uses `expo-constants` for configuration.
    *   Check `app.json` or `app.config.js` if you need to update the `backendUrl`.
    *   By default, it may point to `http://localhost:4000`. If testing on a physical device, update this to your computer's local IP address (e.g., `http://192.168.1.X:4000`) because `localhost` on the phone refers to the phone itself.

## Running the App

1.  **Start the Development Server**:
    ```bash
    npx expo start
    ```
    *   Run `npx expo start -c` to clear cache if you encounter issues.

2.  **Open on Device**:
    *   **QR Code**: Scan the QR code displayed in the terminal using the Expo Go app (Android) or Camera app (iOS).
    *   **Emulators**: Press `a` for Android Emulator or `i` for iOS Simulator (requires setup).

## Testing the App

### Authentication Flow (Recent Updates)
1.  **Login Screen**:
    *   Launch the app. You should see the new Login screen if not authenticated.
    *   **Sliding Toggle**: Tap "Sign Up" / "Login" to switch modes. Verify the sliding animation.
    *   **Sign Up**: Enter Name, Email, Password, and **Confirm Password**.
    *   **Terms Checkbox**: Try to sign up without checking the box. It should show an error.
    *   **Password Visibility**: Tap the "Eye" icon to toggle password visibility.
    *   **SSO Buttons**: Tap "Sign in with Google" or "Apple". (Note: These are currently UI placeholders/mocks until native credentials are set up).

2.  **Logged In State**:
    *   After successful login, you should be redirected to the Home tabs (`(tabs)`).
    *   Verify you can see the list of doctors/hospitals.

### Debugging

1.  **Expo Developer Menu**:
    *   Shake your device (or press `Ctrl+M` / `Cmd+D` in emulator) to open the Developer Menu.
    *   **Reload**: Refreshes the JS bundle.
    *   **Open JS Debugger**: Opens a debugger in Chrome/Edge.
    *   **Show Element Inspector**: Allows you to inspect UI elements.

2.  **Common Issues**:
    *   **Network Request Failed**: Usually due to `localhost` issue. Change backend URL to your machine's IP address.
    *   **Metro Bundler Issues**: Restart with clear cache (`npx expo start -c`).

## Project Structure

*   `app/`: Expo Router pages.
    *   `login.tsx`: The Login/Signup screen.
    *   `(tabs)/`: Main app tabs (Home, Doctors, Schedule, Profile).
    *   `_layout.tsx`: Root layout with navigation and auth protection logic.
*   `context/`: Application state (Auth, Theme).
*   `components/`: Reusable UI components.
*   `assets/`: Images and fonts.

---
**Version**: 1.0
**Last Updated**: January 2026

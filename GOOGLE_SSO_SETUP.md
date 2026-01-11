# Google SSO Production Setup Guide

This guide provides step-by-step instructions for configuring Google OAuth 2.0 (SSO) for the production environment of LifeSync.

## 1. Google Cloud Console Configuration

1.  **Create/Select Project**:
    *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
    *   Create a new project or select your existing LifeSync project.

2.  **Configure OAuth Consent Screen**:
    *   Navigate to **APIs & Services > OAuth consent screen**.
    *   **User Type**: Select **External** (to allow any Google user to sign in).
    *   **App Information**: Provide the App name (LifeSync), user support email, and developer contact info.
    *   **App Domain**:
        *   **Application home page**: `https://yourdomain.com`
        *   **Application privacy policy link**: `https://yourdomain.com/privacy`
        *   **Application terms of service link**: `https://yourdomain.com/terms`
    *   **Authorized domains**: Add your production domain (e.g., `yourdomain.com`).
    *   **Scopes**: Add `openid`, `email`, and `profile`.

3.  **Create Credentials**:
    *   Go to **APIs & Services > Credentials**.
    *   Click **Create Credentials > OAuth client ID**.
    *   **Application type**: **Web application**.
    *   **Name**: `LifeSync Production Web`.
    *   **Authorized JavaScript origins**:
        *   `https://yourdomain.com`
        *   `https://www.yourdomain.com`
    *   **Authorized redirect URIs**:
        *   `https://yourdomain.com` (If using popup flow)
        *   `https://yourdomain.com/login`
    *   Click **Create** and save your **Client ID** and **Client Secret**.

## 2. Environment Variables Update

Update your production `.env` files with the new credentials.

### Backend (`.env`)
```env
GOOGLE_CLIENT_ID=your_production_client_id.apps.googleusercontent.com
```

### Frontend (`.env` or `.env.production`)
```env
VITE_GOOGLE_CLIENT_ID=your_production_client_id.apps.googleusercontent.com
```

## 3. Domain Verification

For production use, Google requires you to verify ownership of your domain.
*   Go to **APIs & Services > Domain Verification**.
*   Follow the prompts to add and verify your production domain.

## 4. Branding Verification (Optional but Recommended)

To remove the "Unverified App" warning during login:
*   In the **OAuth consent screen** tab, click **Submit for Verification**.
*   Ensure you have a professional logo and valid Privacy Policy/Terms of Service pages.
*   Google will review your application (usually takes 2-3 days).

## 5. Mobile App Setup (Expo/Native)

If you are using the mobile app in production:
1.  **Android Client ID**: Create an OAuth client ID for Android. You will need your package name and SHA-1 certificate fingerprint.
2.  **iOS Client ID**: Create an OAuth client ID for iOS. You will need your Bundle ID and App Store ID (if available).
3.  Update the mobile environment constants or `app.json` accordingly.

## 6. Security Checklist

*   **HTTPS**: Ensure your production site is served over HTTPS. Google OAuth will not work on HTTP (except for localhost).
*   **Redirect URIs**: Use exact matches for redirect URIs.
*   **Secret Management**: Never commit your `Client Secret` to version control. Use a secret manager in your CI/CD pipeline.

---
**Last Updated**: January 2026

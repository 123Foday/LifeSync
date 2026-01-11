# Microsoft SSO Porting & Production Setup Guide

This document provides step-by-step instructions for setting up Microsoft Single Sign-On (SSO) for the LifeSync platform using Microsoft Entra ID (formerly Azure AD).

## 1. Microsoft Azure Portal Configuration

1. Log in to the [Microsoft Azure Portal](https://portal.azure.com/).
2. Search for and select **Microsoft Entra ID**.
3. In the left menu, select **App registrations** > **New registration**.
4. Set the following:
   - **Name**: LifeSync
   - **Supported account types**: "Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)"
5. **Redirect URI**:
   - Select **SPA** (Single Page Application).
   - For **Development**: `http://localhost:5173`
   - For **Production**: `https://yourdomain.com`
6. Click **Register**.

## 2. Platform Settings & Authentication

1. Go to **Authentication** under the app registration.
2. Ensure **Access tokens** and **ID tokens** are checked for Implicit grant and hybrid flows if you are using MSAL.js directly on the frontend.
3. For increased security in production, prefer the **Auth Code Flow with PKCE**.

## 3. API Permissions

1. Select **API permissions** > **Add a permission**.
2. Choose **Microsoft Graph** > **Delegated permissions**.
3. Ensure the following are added:
   - `User.Read` (Sign in and read user profile)
   - `email` (View users' email address)
   - `profile` (View users' basic profile)
   - `openid` (Sign users in)
4. Click **Add permissions**.

## 4. Environment Variables Configuration

Copy the **Application (client) ID** and **Directory (tenant) ID** from the **Overview** page.

### Backend (`backend/.env`)
Add the following variables:
```env
# Microsoft SSO
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_TENANT_ID=common # or your specific tenant id
```

### Frontend (`frontend/.env`)
Add the following variables:
```env
VITE_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

## 5. Integration Flow

1. **Frontend**: Use `@azure/msal-browser` and `@azure/msal-react` to trigger the login popup.
2. **Backend**: The frontend sends the `accessToken` to the `/api/user/microsoft-login` endpoint.
3. **Verification**: The backend verifies the token by calling `https://graph.microsoft.com/v1.0/me`.

## 6. Production Checklist
- [ ] Ensure Redirect URIs match your production domain precisely.
- [ ] Use a custom domain in Azure if possible for brand consistency.
- [ ] Ensure HTTPS is enabled on your production server.
- [ ] Configure `tenant_id` as `common` to allow all Microsoft accounts (Personal & Business).

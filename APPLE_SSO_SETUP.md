# Apple Sign-In Setup Guide for LifeSync

This guide will walk you through setting up Apple Sign-In for the LifeSync application.

## Prerequisites

- An Apple Developer Account ($99/year)
- Access to [Apple Developer Portal](https://developer.apple.com)
- Your application's domain (for web authentication)

## Step 1: Register Your App ID

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click on **Identifiers** in the sidebar
4. Click the **+** button to create a new identifier
5. Select **App IDs** and click **Continue**
6. Select **App** and click **Continue**
7. Fill in the details:
   - **Description**: LifeSync
   - **Bundle ID**: `com.lifesync.service` (or your preferred bundle ID)
   - **Explicit** Bundle ID type
8. Scroll down to **Capabilities** and check **Sign in with Apple**
9. Click **Continue** and then **Register**

## Step 2: Create a Services ID (for Web)

1. In the **Identifiers** section, click the **+** button again
2. Select **Services IDs** and click **Continue**
3. Fill in the details:
   - **Description**: LifeSync Web Service
   - **Identifier**: `com.lifesync.service.web` (must be different from App ID)
4. Click **Continue** and then **Register**
5. Click on your newly created Services ID
6. Check **Sign in with Apple**
7. Click **Configure** next to Sign in with Apple
8. Configure the following:
   - **Primary App ID**: Select your App ID from Step 1
   - **Web Domain**: Your domain (e.g., `lifesync.com`)
   - **Return URLs**: Add your callback URLs:
     - Production: `https://yourdomain.com`
     - Development: `http://localhost:5173` (or your dev port)
9. Click **Save**, then **Continue**, then **Save** again

## Step 3: Create a Private Key

1. In the sidebar, click on **Keys**
2. Click the **+** button to create a new key
3. Fill in the details:
   - **Key Name**: LifeSync Sign in with Apple Key
4. Check **Sign in with Apple**
5. Click **Configure** next to Sign in with Apple
6. Select your **Primary App ID** from Step 1
7. Click **Save**, then **Continue**, then **Register**
8. **IMPORTANT**: Download the private key file (`.p8`)
   - You can only download this ONCE
   - Store it securely - you'll need it for server-side verification
9. Note down the **Key ID** displayed on the screen

## Step 4: Get Your Team ID

1. In the Apple Developer Portal, click on your name in the top right
2. Go to **Membership**
3. Note down your **Team ID** (10-character string)

## Step 5: Configure Environment Variables

### Frontend (.env)

Create or update `frontend/.env`:

```env
# Apple Sign-In Configuration
VITE_APPLE_CLIENT_ID=com.lifesync.service.web
VITE_APPLE_REDIRECT_URI=http://localhost:5173
```

For production, update to:
```env
VITE_APPLE_CLIENT_ID=com.lifesync.service.web
VITE_APPLE_REDIRECT_URI=https://yourdomain.com
```

### Backend (.env)

Add to `backend/.env`:

```env
# Apple Sign-In Configuration (for server-side verification - optional but recommended)
APPLE_CLIENT_ID=com.lifesync.service.web
APPLE_TEAM_ID=YOUR_TEAM_ID_HERE
APPLE_KEY_ID=YOUR_KEY_ID_HERE
APPLE_PRIVATE_KEY_PATH=./config/AuthKey_XXXXXXXXXX.p8
```

**Note**: For production, you should verify the Apple ID token on the server using these credentials. The current implementation uses client-side verification for simplicity.

## Step 6: Implement Server-Side Verification (Recommended for Production)

For production environments, you should verify the Apple ID token on the server. Here's how:

### Install Required Package

```bash
cd backend
npm install apple-signin-auth
```

### Update the Apple Login Controller

Replace the token decoding in `backend/controllers/userController.js` with proper verification:

```javascript
import appleSignin from 'apple-signin-auth';

const appleLoginController = async (req, res) => {
  try {
    const { authorization, user } = req.body

    if (!authorization || !authorization.id_token) {
      return res.status(400).json({
        success: false,
        message: 'Apple authorization is required',
      })
    }

    // Verify the Apple ID token with Apple's servers
    const appleResponse = await appleSignin.verifyIdToken(
      authorization.id_token,
      {
        audience: process.env.APPLE_CLIENT_ID,
        ignoreExpiration: false, // Reject expired tokens
      }
    );

    const { sub: appleId, email } = appleResponse;

    // ... rest of the controller logic
  } catch (error) {
    console.error('Apple login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error during Apple login',
    })
  }
}
```

## Step 7: Testing

### Development Testing

1. Start your frontend and backend servers
2. Navigate to the login page
3. Click "Sign in with Apple"
4. A popup will appear asking you to sign in with your Apple ID
5. After successful authentication, you'll be redirected back to your app

### Test Accounts

- Use your personal Apple ID for testing
- Apple provides test accounts in the App Store Connect sandbox for iOS app testing

## Step 8: Production Deployment

### Domain Verification

1. Ensure your domain is verified in the Services ID configuration
2. Update the Return URLs to include your production domain
3. Update environment variables with production values

### Security Checklist

- ✅ Store private keys securely (never commit to git)
- ✅ Use environment variables for sensitive data
- ✅ Implement server-side token verification
- ✅ Use HTTPS in production
- ✅ Validate all user inputs
- ✅ Implement rate limiting on auth endpoints

## Troubleshooting

### "Invalid Client" Error

- Verify your Client ID matches the Services ID identifier
- Check that your domain is properly configured in the Services ID
- Ensure the Return URL matches exactly (including protocol and port)

### "Invalid Grant" Error

- The authorization code may have expired (they're single-use)
- Check that your server time is synchronized

### Token Verification Fails

- Verify your Team ID, Key ID, and Private Key are correct
- Ensure the private key file is accessible to your server
- Check that the token hasn't expired

### Popup Blocked

- Ensure popups are allowed for your domain
- Consider using redirect flow instead of popup for better compatibility

## Additional Resources

- [Apple Sign-In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [Apple Sign-In REST API](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)

## Support

For issues specific to LifeSync implementation, please contact the development team.

For Apple-specific issues, refer to:
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Apple Developer Support](https://developer.apple.com/support/)

---

**Last Updated**: January 2026
**Version**: 1.0

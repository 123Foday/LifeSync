# LifeSync Backend API

The core engine for LifeSync, providing RESTful endpoints, authentication, and database management.

## ⚙️ Key Services
- **Auth Service**: JWT-based session management and RBAC.
- **Appointment Service**: Logic for booking, cancelling, and slot management.
- **Provider Service**: Management of doctor profiles and availability.
- **Image Service**: Integration with Cloudinary for asset storage.

## 🛠️ Tech Stack
- **Node.js**: Runtime environment.
- **Express**: Framework for APIs.
- **MongoDB**: Primary database.
- **Mongoose**: ODM for MongoDB.
- **Cloudinary**: Cloud-based image management.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   Create a `.env` file with the following:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PORT` (default: 4000)
   - `GOOGLE_CLIENT_ID` (for portal authentication)
   - `APPLE_CLIENT_ID` (for portal authentication)

   *For production SSO configuration, refer to the root [GOOGLE_SSO_SETUP.md](../GOOGLE_SSO_SETUP.md) and [APPLE_SSO_SETUP.md](../APPLE_SSO_SETUP.md).*

3. **Run Server**
   ```bash
   npm run server  # For development (with nodemon)
   npm start       # For production
   ```

## 🧪 Testing
Run unit and integration tests:
```bash
npm test
```

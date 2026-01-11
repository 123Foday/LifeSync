# LifeSync Setup & Development Log

This document provides detailed setup instructions and keeps track of major development milestones and configurations for the LifeSync ecosystem.

## 🚀 Quick Start Setup

### 1. Prerequisites
- **Node.js**: v18.x or higher recommended.
- **MongoDB**: A running instance (local or MongoDB Atlas).
- **Cloudinary Account**: For image storage and optimization.
- **Expo Go**: (Mobile) Installed on your physical device or an Android/iOS emulator.

### 2. Environment Configuration

#### Backend `.env`
Create `backend/.env` with the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
PORT=4000
GOOGLE_CLIENT_ID=your_google_client_id
APPLE_CLIENT_ID=your_apple_client_id
MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

> **Note**: For detailed SSO configuration, refer to the [Google SSO Setup](./GOOGLE_SSO_SETUP.md), [Apple SSO Setup](./APPLE_SSO_SETUP.md), and [Microsoft SSO Setup](./MICROSOFT_SSO_SETUP.md) guides.

#### Frontend & Admin `.env`
Create `.env` in `frontend/` and `admin/` (if needed for API URLs):
```env
VITE_BACKEND_URL=http://localhost:4000
```

### 3. Installation & Running

Run these commands in separate terminals:

| Module | Command to Install | Command to Run | Default URL |
| :--- | :--- | :--- | :--- |
| **Backend** | `cd backend && npm install` | `npm run server` | `http://localhost:4000` |
| **Frontend** | `cd frontend && npm install` | `npm run dev` | `http://localhost:5173` |
| **Admin** | `cd admin && npm install` | `npm run dev` | `http://localhost:5174` |
| **Mobile** | `cd mobile && npm install` | `npx expo start` | Expo Dev Menu |

---

## 📝 Development Log

### [2025-12-29] - Major UI Overhaul (Frontend)
- **Design System**: Refactored the entire frontend to use a "Premium" design system featuring glassmorphism, rich gradients, and animation-heavy interactables.
- **Redesign**:
    - **Banner**: Redesigned with a split-layout, premium gradients, and interactive CTA buttons.
    - **Header**: Updated to a modern Hero section with dynamic typography.
    - **TopDoctors & TopHospitals**: Converted to premium card grids with hover effects and status indicators.
    - **About Page**: Completely revamped with a dark-themed hero section, floating badges, and an icon-rich "Why Choose Us" section.
    - **Footer**: Redesigned with a spacious, 4-column aesthetic layout, status indicators, and enhanced hover interactions.
- **Performance & Fixes**:
    - **Icons**: Replaced external icon libraries with inline SVGs to fix rendering issues and improve load times.
    - **Bug Fix**: Resolved a critical "blank screen" rendering crash caused by icon hoisting issues.
    - **Bug Fix**: Fixed an object rendering crash in `TopHospitals` by safely accessing address properties.
- **Security**: Implemented secure account deletion with password/OTP verification and automated email notifications.
- **SSO**: Integrated Microsoft SSO (Entra ID) for both web and mobile authentication.
- **Legal**: Added high-fidelity Terms & Conditions and Privacy Policy pages for full regulatory compliance.

### [2025-12-29] - Documentation & Mobile Integration
- **Docs**: Created `setup.md` to centralize setup instructions and development history.
- **Docs**: Updated root `README.md` to include documented support for the `mobile` application.
- **Docs**: Modernized `frontend/README.md`, `admin/README.md`, and `mobile/README.md`.
- **Docs**: Created dedicated `backend/README.md`.
- **Docs**: Added production setup guides for [Google SSO](./GOOGLE_SSO_SETUP.md) and [Apple Sign-In](./APPLE_SSO_SETUP.md).
- **Docs**: Created a comprehensive [Mobile Setup](./MOBILE_SETUP.md) guide for Expo developers.

### [2025-12-21] - Dark Mode & Mobile Initial Work
- **Mobile**: Initiated React Native mobile application.
- **UI**: Implemented core Dark Mode functionality across the mobile app.
- **Routing**: Set up Expo Router for navigation in the mobile app.
- **State**: Integrated shared authentication logic into the mobile platform.

### [2025-12-18] - Security & Session Polish
- **Frontend**: Implemented global axios response interceptors to handle 401 (Unauthorized) errors.
- **Backend**: Enhanced middleware to provide specific error messages (e.g., "jwt expired").
- **UX**: Added automatic redirect to login upon session expiration.

### [2025-12-06] - Core Engines & Intelligence
- **AI**: Implemented AI Decision Support Engine for workflow analysis (Milestone 9).
- **Analytics**: Developed Reporting & Analytics Engine for high-level data visibility (Milestone 8).
- **Core**: Defined MongoDB schemas for core entities (users, workflows, tokens).

---

## 📦 Infrastructure Evolution

1. **Phase 1: Foundation (Nov 2025)**
    - Initialized MERN stack backend.
    - Set up base React applications for Frontend and Admin.
    - Integrated Cloudinary for media management.

2. **Phase 2: Feature Expansion (Dec 2025)**
    - Developed specific workflows for Doctors and Patients.
    - Implemented Appointment Booking logic with real-time slot checking.
    - Added comprehensive Admin controls for doctor management.

3. **Phase 3: Intelligence & Optimization (Late Dec 2025)**
    - Integrated AI-driven insights for workflow monitoring.
    - Optimized session handling and security protocols.
    - Launched the Mobile companion app with Expo.

---

## 🛠️ Infrastructure Notes

### API Architecture
- **Authentication**: JWT based, shared across Web and Mobile.
- **Image Handling**: Handled via Cloudinary through the Backend API.
- **State Management**: React Context API is used for global state (Auth, Appointments, etc.).

### Mobile App Details
- Built with **Expo** and **React Native**.
- Uses **Expo Router** for file-based routing.
- Styled with **NativeWind** (Tailwind for React Native) where applicable.

---

## 📌 TODO / Roadmap
- [ ] Integrate Real-time Notifications (Socket.IO) across all platforms.
- [ ] Implement Offline Mode for the Mobile App.
- [x] Add Multi-language support (i18n) - *Partially implemented via SEO/Meta enhancements*.
- [ ] Implement automated CI/CD pipelines.
- [x] Full SSO Suite (Google, Apple, Microsoft).
- [x] Legal & Compliance Framework (T&C, Privacy Policy).

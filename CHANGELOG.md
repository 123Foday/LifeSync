# Changelog
 
All notable changes to this project will be documented in this file.
 
## [2026-01-12] - Production Readiness & Infrastructure
- **Backend Optimization**:
    - **Production Readiness**: Upgraded `server.js` with `helmet` security headers, `compression` for performance, and `morgan` for detailed request logging.
    - **Error Handling**: Implemented a Global Error Handler and 404 middleware to standardize API responses and prevent crashes.
    - **Reliability**: Added **Graceful Shutdown** logic (SIGTERM) to handle clean environment transitions during deployment.
    - **Load Balancing**: Configured **Trust Proxy** settings for accurate IP detection behind platforms like Railway/Vercel.
    - **Email Verification**: Verified and tested the **Gmail SMTP** delivery system with production credentials.
- **Monitoring**: Added a `/health` endpoint for automated system monitoring and uptime tracking.

## [2026-01-11] - Security Enhancements & SSO Expansion
- **Security & Privacy**:
    - **Account Deletion**: Added a secure account deletion flow in "My Profile" with password/OTP confirmation.
    - **Email Notifications**: Implemented automated security emails for account deletion, email changes, and OTP verifications.
    - **Email Change Flow**: Enhanced account security with a multi-step verification process for changing registered emails.
- **SSO Suite**:
    - **Microsoft SSO**: Added backend support and integration for Microsoft Entra ID (Azure AD) login.
    - **Documentation**: Created `MICROSOFT_SSO_SETUP.md` with detailed portal configuration for developer and production environments.
- **Legal**: 
    - **Compliance**: Added "Terms & Conditions" and "Privacy Policy" pages to ensure regulatory compliance and user transparency.
- **Backend Refinement**:
    - **Data Integrity**: Optimized user controllers to purge associated data (appointments, OTPs) upon account closure.
    - **OTP System**: Expanded OTP purpose enum to include granular security actions (deletion, change verification).

## [2026-01-10] - Authentication UI & Production SSO Suite
- **Auth UI (Web & Admin)**:
    - **Premium Login**: Implemented a sliding toggle for Login/Signup, LifeSync branding, and centered layout.
    - **Security UX**: Added "eye" toggle for password visibility and "Confirm Password" field for signups.
    - **SSO Rebrand**: Rebuilt Google and Apple SSO buttons as custom components to ensure identical premium design.
    - **Terms Alignment**: Added mandatory T&C checkbox for customer signups.
- **Mobile App**:
    - **Login Implementation**: Created a new mobile login screen matching the web's premium sliding toggle and SSO buttons.
    - **Auth Navigation**: Updated root layout with a loading spinner and dedicated redirection logic to handle protected routes.
- **Backend**:
    - **Flexible Auth**: Updated Google login controller to support both ID Tokens and Access Tokens for custom frontend buttons.
    - **SSO Integration**: Added Apple Sign-In backend support and improved account linking logic.
- **Docs**:
    - **Setup Suite**: Created `GOOGLE_SSO_SETUP.md` (Production instructions), `APPLE_SSO_SETUP.md`, and `MOBILE_SETUP.md` (Expo guide).
    - **Project Overview**: Updated `README.md` and `IMPLEMENTATION_SUMMARY.md` with centralized documentation links.

## [2025-12-30] - Professional Documentation Suite
- **Docs**: Added `IMPLEMENTATION_SUMMARY.md` detailing project status, recent UI overhauls, and stability fixes.
- **Docs**: Created `ARCHITECTURE.md` providing a high-level technical overview of the MERN + Mobile stack and data flow.
- **Docs**: Updated `README.md` with a centralized "Documentation & References" section linking to all key project documents.

## [2025-12-29] - Major UI Overhaul (Frontend)
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
    - **Header Optimization**: Reduced padding, gap, and font sizes in `Header` component for a more compact and visible default view.

## [2025-12-29] - Documentation & Ecosystem Sync
- **Docs**: Created comprehensive `setup.md` with detailed installation guides and development history.
- **Docs**: Synchronized all sub-package READMEs (`backend`, `frontend`, `admin`, `mobile`) with project-specific details.
- **Docs**: Updated root `README.md` to include documented support for the mobile application and link to detailed setup logs.
- **Docs**: Added ports and environment configuration notes to central documentation.

## [2025-12-18] - Authentication & Session Handling
- Frontend: Added global axios response interceptor to detect expired/invalid JWTs and automatically clear the session, show a toast message "Session expired. Please log in again.", and redirect the user to `/login`.
- Backend: Standardized authentication middlewares (`authUser`, `authDoctor`, `authHospital`) to return HTTP 401 with the original error message (for example, "jwt expired") so the frontend can reliably detect expiry and act accordingly.
- UI: Added logout toast and mobile Logout button to the `Navbar` for a clear sign-out UX.

## [2025-11-01] - Admin Frontend fixes & Test Improvements
- Fixed ESLint hook dependency warnings in `AdminContext` and `HospitalContext`.
- Fixed incorrect context import in `admin/src/pages/Hospital/HospitalAppointment.jsx`.
- Converted backend tests to use ES modules and added more booking/cancellation tests.

### Files changed (summary)
- `admin/src/context/AdminContext.jsx`, `admin/src/context/HospitalContext.jsx`, `admin/src/pages/Hospital/HospitalAppointment.jsx`, `admin/src/App.jsx`
- `backend/test/booking.test.js`, `backend/package.json`

## Recommendations
- Add more tests (edge cases & integration)
- Add CI with linting and tests
- Consider TypeScript for stronger types
- Improve error handling and add loading states

---

*This changelog follows a lightweight format for human readers. Move items from [Unreleased] to a dated section when you release.*
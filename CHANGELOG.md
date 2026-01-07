# Changelog

All notable changes to this project will be documented in this file.

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
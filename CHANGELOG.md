# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- Docs: Update `README.md` and `CHANGELOG.md` with project overview and setup instructions.
- Doc: Add notes about ports and asset keys.

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
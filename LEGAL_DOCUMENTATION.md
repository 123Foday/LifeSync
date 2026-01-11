# Legal & Compliance Documentation

This document outlines the implementation and content of LifeSync's legal framework, including the Terms & Conditions and Privacy Policy.

## 1. Implementation Overview

LifeSync prioritizes user transparency and regulatory compliance (GDPR, HIPAA-alignment). The following components have been implemented:

### Frontend Pages
- **Terms & Conditions**: `/terms-conditions`
- **Privacy Policy**: `/privacy-policy`
- Accessible via the site footer on all pages.

### Consent Management
- **Signup Enforcement**: A mandatory checkbox has been added to the web and mobile signup screens. Users must acknowledge and agree to both documents before an account can be created.
- **SSO Acknowledgement**: The Terms & Conditions explicitly mention that using SSO (Google, Apple, Microsoft) authorizes LifeSync to access basic profile data as per the Privacy Policy.

## 2. Terms & Conditions Summary

The [Terms & Conditions](./frontend/src/pages/TermsAndConditions.jsx) cover:
- **Acceptance of Terms**: Legal binding of the user to platform rules.
- **Service Description**: LifeSync as a facilitator, not a direct medical provider.
- **User Accounts**: Eligibility (18+), responsibility for credentials, and accurate data requirements.
- **Appointments**: Real-time booking rules and cancellation policies.
- **SSO Authentication**: Authorization for third-party data access.
- **Account Deletion**: User rights and the irreversible nature of the "Danger Zone" purge.
- **Limitation of Liability**: Protection for the platform regarding indirect damages.

## 3. Privacy Policy Summary

The [Privacy Policy](./frontend/src/pages/PrivacyPolicy.jsx) covers:
- **Information Collection**: Name, contact details, medical history, and device/log data.
- **Use cases**: Facilitating appointments, security alerts, and service optimization.
- **Data Sharing**: Limited sharing with healthcare providers and necessary third-party vendors.
- **Security Protocols**: Industry-standard encryption (AES-256) and secure storage.
- **Data Retention**: Right to be forgotten through account deletion, resulting in permanent data removal.

## 4. Security & Data Protection

- **Encryption**: All data in transit is protected via TLS 1.2+.
- **Verification**: Sensitive actions (email change, account deletion) require multi-factor verification (Password or OTP).
- **Notifications**: Automated emails are triggered for all critical account security events.

---

*Last Updated: January 11, 2026*

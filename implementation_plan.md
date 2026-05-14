# Implementation Plan: Emergency Phone Number SMS Alert System

Adds real-time Twilio SMS alerts that fire whenever a user triggers any SOS event. Emergency phone numbers are managed by users per-session (localStorage persisted) and sent alongside the SOS payload to the Node backend, which dispatches SMS in parallel with email.

## User Review Required

> [!IMPORTANT]
> Twilio credentials (`TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`) are already present in [backend/.env](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/backend/.env) with placeholder values. You **must** fill these in with real Twilio credentials for SMS to actually send. A free Twilio trial account works fine.

## Proposed Changes

### Backend
---
#### [MODIFY] [package.json](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/backend/package.json)
- Add `twilio` as a dependency.

#### [NEW] [backend/services/smsService.js](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/backend/services/smsService.js)
- Wraps the Twilio SDK. Exports a `sendSMS(toNumbers[], messageText)` function.
- Handles multi-recipient by iterating over numbers and firing `twilio.messages.create()` for each.
- Formats the SMS body to include name, maps link, emergency type, and timestamp.

#### [MODIFY] [backend/controllers/sosController.js](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/backend/controllers/sosController.js)
- Destructure `emergencyPhones` from `req.body`.
- After saving to MongoDB and dispatching email, call the new `smsService.sendSMS(emergencyPhones, body)` in parallel.
- SMS failures are caught independently — they will not block the main SOS response.

### Frontend
---
#### [MODIFY] [src/store/useAppStore.ts](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/src/store/useAppStore.ts)
- Add `emergencyPhones: string[]` alongside the existing `familyContacts`.
- Add `addEmergencyPhone(phone: string)` and `removeEmergencyPhone(phone: string)` actions, backed by localStorage for persistence.

#### [NEW] [src/components/dashboard/EmergencyContacts.tsx](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/src/components/dashboard/EmergencyContacts.tsx)
- A self-contained, reusable card component for managing phone numbers.
- Input field with `tel` type and basic validation (must start with `+` for international format).
- Shows the list of saved numbers with delete button per row.
- Sends an SMS test confirmation to user.

#### [MODIFY] [src/pages/CitizenDashboard.tsx](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/src/pages/CitizenDashboard.tsx)
- Import and render `<EmergencyContacts />` component.
- Update [sendSOS()](file:///c:/Users/ASUS/Downloads/smart-rescue-coordination-platform/src/pages/CitizenDashboard.tsx#176-219) to include `emergencyPhones` in the API fetch payload.

## Verification Plan

### Manual Verification
1. Open the app, add a phone number (e.g., `+919876543210`) in the Emergency Contacts section.
2. Press the SOS button — inspect the browser **Network tab** to confirm the POST request to `/api/sos` includes the `emergencyPhones` array.
3. Check Node backend console — it should log SMS dispatch attempts.
4. Verify receipt of SMS on the configured phone numbers (requires valid Twilio credentials).

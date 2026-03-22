# FIREBASE_SETUP.md

## Goal

Integrate Firebase Cloud Messaging (FCM) into an Angular Progressive Web App so the application can:

- request push notification permission
- register the current device/browser
- obtain an FCM token
- receive notifications in foreground
- receive notifications in background through a service worker
- support Android and iOS PWA usage as much as the platform allows

---

## Firebase Project

Use this Firebase project configuration in the Angular application:

```ts
export const firebaseConfig = {
  apiKey: "AIzaSyBrXVsvF_8bNIAapn_Qeoy3PpXDQsJRgLU",
  authDomain: "notifiche-fb2d2.firebaseapp.com",
  projectId: "notifiche-fb2d2",
  storageBucket: "notifiche-fb2d2.firebasestorage.app",
  messagingSenderId: "286912767730",
  appId: "1:286912767730:web:cd34c27890a2c1fdc5126b",
  measurementId: "G-R0G4CGXTWZ"
};
```

---

## Important Security Notes

### Public client config
The Firebase config above is public and can be included in the Angular frontend.

### Secret keys
Do NOT store any server credentials, private keys, admin SDK credentials, or secret API keys in the frontend codebase or in the public GitHub repository.

### VAPID key
Web push with Firebase Messaging requires a Web Push certificate key pair.

The Angular app must use the public VAPID key when requesting the FCM token.

Add a placeholder for it in the project configuration and make the integration ready for it:

```ts
export const firebaseWebPush = {
  vapidKey: "REPLACE_WITH_PUBLIC_VAPID_KEY"
};
```

Codex must prepare the code so the VAPID key is read from Angular environment files.

---

## Required Angular Configuration

Create environment files and place Firebase configuration there.

### Example structure

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

### Required exported configuration

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBrXVsvF_8bNIAapn_Qeoy3PpXDQsJRgLU",
    authDomain: "notifiche-fb2d2.firebaseapp.com",
    projectId: "notifiche-fb2d2",
    storageBucket: "notifiche-fb2d2.firebasestorage.app",
    messagingSenderId: "286912767730",
    appId: "1:286912767730:web:cd34c27890a2c1fdc5126b",
    measurementId: "G-R0G4CGXTWZ"
  },
  firebaseMessaging: {
    vapidKey: "REPLACE_WITH_PUBLIC_VAPID_KEY"
  }
};
```

Use the same structure in production environment.

---

## Required Firebase Integration

Codex must integrate Firebase using the modular SDK.

Install required packages:

- `firebase`

The app must:

1. initialize Firebase app once
2. initialize Firebase Messaging only in browser contexts that support it
3. gracefully handle unsupported browsers/platforms
4. expose a dedicated messaging service

---

## Required Messaging Service Responsibilities

Create a dedicated Angular service, for example:

- `firebase-messaging.service.ts`

Responsibilities:

- initialize Firebase app
- check whether messaging is supported
- request browser notification permission
- get FCM token using the public VAPID key
- listen for foreground messages
- expose current permission state
- expose token refresh/update flow
- return structured results and errors
- never crash if permission is denied or unsupported

---

## Foreground Notifications

When the app is open and active, the Angular app must listen for foreground messages.

Required behavior:

- receive FCM messages while app is open
- show in-app feedback such as snackbar/toast
- optionally update the channel notifications list in real time
- persist received notification in local app state or storage if needed

---

## Background Notifications

When the app is not in the foreground, notifications must be handled by a service worker.

Create:

- `src/firebase-messaging-sw.js`

This file must:

- initialize Firebase inside the service worker
- register background message handling
- display notifications with title, body, icon, and optional image/data
- support click actions when possible
- open or focus the app when a notification is clicked

Codex must ensure this file is properly included in the final build/deployment strategy.

---

## Notification Click Behavior

When the user taps a notification, the app should:

- open the PWA/site
- navigate to the relevant channel when channel information is available
- pass useful payload data such as:
  - `channelCode`
  - `notificationId`
  - `deepLink`

Use a structured `data` payload in sent notifications.

---

## Device Registration Flow

After onboarding, once the user has:

- scanned the QR code
- entered a nickname
- confirmed subscription

the app must:

1. request notification permission
2. obtain FCM token
3. generate or retrieve a local `deviceId`
4. save local registration state
5. associate the FCM token with the device
6. associate the device with one or more channels

The registration model should include at least:

- `deviceId`
- `nickname`
- `fcmToken`
- `platform`
- `notificationPermission`
- `subscribedChannels`

---

## Local Persistence

Store locally at minimum:

- nickname
- deviceId
- subscribed channels
- last known FCM token
- notification permission state
- onboarding completed flag

Use a simple persistence strategy such as:

- `localStorage` initially

Structure code so this can later be replaced with IndexedDB or API persistence.

---

## Token Refresh / Token Update Strategy

The app must be built so token changes are handled safely.

Required behavior:

- compare stored token with newly generated token
- update local persisted registration if token changes
- keep logic isolated in the messaging service
- avoid duplicate registrations where possible

---

## Permission Handling

The app must clearly handle all notification permission states:

- `default`
- `granted`
- `denied`

Required UX behavior:

### default
Show a clear CTA to enable notifications.

### granted
Proceed with token registration and show success state.

### denied
Show an informative banner/card explaining that notifications are disabled and that the user must re-enable them from browser/device settings.

Do not repeatedly spam permission requests.

---

## iOS / PWA Notes

This project must be built as a PWA-first solution.

Important product assumptions:

- Android supports web push well in modern browsers/PWA flows
- iOS support is tied to PWA-style usage and user installation flow
- the UX must guide users to install the app on the Home Screen when needed
- the app must include install instructions/banner logic for platforms that do not expose a native install prompt

The app should not assume identical notification behavior across all browsers/platforms.

Codex must implement defensive checks and user-friendly messaging.

---

## Angular PWA Integration Requirements

The project must include:

- Angular service worker enabled
- `manifest.webmanifest`
- app icons
- installability support
- PWA install banner logic
- notification permission banner logic

Firebase Messaging integration must work alongside Angular PWA behavior.

---

## Suggested File Structure

```txt
src/
  app/
    core/
      services/
        firebase-messaging.service.ts
        notification-permission.service.ts
        device-registration.service.ts
      models/
        device-registration.model.ts
        notification-item.model.ts
        channel.model.ts
  environments/
    environment.ts
    environment.prod.ts
  firebase-messaging-sw.js
```

---

## Required Error Handling

Codex must implement safe handling for:

- unsupported browser
- unsupported messaging environment
- missing VAPID key
- denied notification permission
- token retrieval failure
- service worker registration failure
- malformed notification payload
- offline state

The app must remain usable even when push notifications are unavailable.

---

## Required UI States

The app must provide visible UI for:

- notifications supported / unsupported
- permission not requested
- permission granted
- permission denied
- PWA not installed
- device successfully registered
- token unavailable
- channel successfully subscribed

---

## Analytics

`measurementId` is available in the Firebase config, but analytics is optional.

Do not block the project on analytics setup.

If analytics is added, keep it optional and isolated.

---

## GitHub Hosting / Deployment Notes

This project will be hosted in a GitHub repository.

Codex must:

- keep public Firebase client config in environment files
- never commit secrets
- keep the project deployable as a static Angular PWA
- prepare the codebase so notification sending can later be connected to a backend or Firebase Cloud Functions

---

## Out of Scope for This Frontend Phase

The following are not required in the first frontend-only implementation:

- Firebase Admin SDK in frontend
- server-side push sending logic
- private service account credentials
- full backend persistence
- authentication system

Use mock services/interfaces where needed, but prepare clean extension points for later backend integration.

---

## Implementation Expectations for Codex

Codex must produce:

- a clean Angular Firebase initialization
- environment-based Firebase config
- a dedicated Firebase Messaging service
- foreground notification handling
- background notification handling through `firebase-messaging-sw.js`
- token retrieval using public VAPID key
- resilient permission handling
- clean integration with onboarding and channel subscription flow

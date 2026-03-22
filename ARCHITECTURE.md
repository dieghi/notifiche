# ARCHITECTURE.md

## Stack

- Angular (latest stable)
- Standalone components
- Angular Material
- Firebase Web SDK
- Firebase Cloud Messaging
- Angular Service Worker / PWA
- LocalStorage for initial persistence
- Optional Firebase Cloud Functions for notification sending

## Architecture Style

Use a feature-oriented Angular architecture with a small shared/core layer.

## Folder Structure

```txt
src/
  app/
    core/
      models/
      services/
      utils/
      guards/
    features/
      onboarding/
        welcome/
        qr-scan/
        nickname/
      home/
      channels/
        channel-detail/
        add-channel/
      settings/
    shared/
      components/
      ui/
      pipes/
      directives/
    app.routes.ts
  environments/
    environment.ts
    environment.prod.ts
  firebase-messaging-sw.js
  manifest.webmanifest
```

## Core Layer Responsibilities

### models
Contains domain models and interfaces such as:

- Channel
- ChannelSubscription
- DeviceRegistration
- NotificationItem
- SenderPayload

### services
Contains cross-cutting services such as:

- firebase-messaging.service.ts
- device-registration.service.ts
- channel.service.ts
- notification.service.ts
- notification-sender.service.ts
- pwa.service.ts
- qr.service.ts
- local-storage.service.ts

### utils
Small helpers for:

- QR parsing
- platform detection
- install-prompt handling
- date formatting helpers

## Feature Modules / Areas

### onboarding
Responsible for first-launch flow.

Screens:
- welcome
- qr scan
- nickname entry

### home
Responsible for:
- listing subscribed channels
- showing banners
- empty state
- navigation to add channel and details

### channels
Responsible for:
- add channel flow
- channel detail page
- notifications list
- sender-only send form

### settings
Optional minimal settings page for:
- app info
- notification status
- local reset action

## State Management Strategy

Do NOT use NgRx unless strictly necessary.

Use:
- Angular services
- signals or RxJS where helpful
- local persistence for lightweight state

## Persistence Strategy

Initial persistence:

- LocalStorage for:
  - deviceId
  - nickname
  - onboardingCompleted
  - subscriptions
  - last known FCM token
  - permission state
  - cached notifications

Structure services so persistence can later be swapped with:
- IndexedDB
- REST API
- Firestore

## Messaging Architecture

### Receive Flow
1. App starts
2. Firebase messaging service initializes
3. Service checks support and permission
4. Token retrieved using VAPID key
5. Token stored locally
6. Foreground notifications handled in app
7. Background notifications handled in service worker

### Send Flow
If current subscription role is sender:
1. User fills title + body
2. Frontend calls sending service
3. Sending service calls Cloud Function or mock backend
4. Notification is dispatched to receiver devices of that channel

## Role Model

Every channel subscription has one role:

- receiver
- sender

The same device may have:
- receiver role on one channel
- sender role on another channel

## Routing Proposal

```txt
/
  -> redirect based on onboarding state

/onboarding/welcome
/onboarding/scan
/onboarding/nickname

/home
/channels/add
/channels/:channelCode
/settings
```

## UX System Components

Create shared components for:

- install-pwa-banner
- notification-permission-banner
- channel-card
- role-badge
- empty-state
- loading-state
- qr-scanner
- sender-form
- notification-list-item

## Error Handling Philosophy

The app must remain usable even if push notifications are unavailable.

Gracefully handle:
- unsupported browsers
- denied permissions
- invalid QR content
- missing VAPID key
- FCM token failures
- offline mode

## Deployment Philosophy

The frontend should remain deployable as a static Angular PWA.

Do not tightly couple the frontend to a complex backend.

Keep sending integration abstracted so it can later use:
- Firebase Cloud Functions
- REST backend
- mock service

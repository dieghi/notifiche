# FEATURES.md

## Functional Overview

This document describes the required features for NotifyQR.

---

## 1. First Launch Onboarding

The first time the app is opened, the onboarding flow is mandatory.

### Required steps
1. Welcome screen
2. QR scan screen
3. Nickname input screen
4. Confirmation / registration
5. Redirect to Home

### Rules
- If no local onboarding state exists, redirect user into onboarding
- User must complete QR + nickname before entering the app
- QR must be parsed before registration proceeds

---

## 2. QR Scan

The app must support scanning QR codes using the device camera.

### QR content must provide:
- channel code
- role

### Accepted role values
- receiver
- sender

### Example QR
`myapp://channel?code=QUEST_ROMA&role=receiver`

### Required behavior
- detect malformed QR
- show user-friendly error if invalid
- allow rescan
- store parsed QR info temporarily through onboarding flow

---

## 3. Nickname Input

After a valid QR is scanned, the user must insert a nickname.

### Rules
- nickname required
- basic validation only
- no complex auth needed
- nickname belongs to the device registration state

---

## 4. Device Registration

After nickname confirmation:

### App must:
- request notification permission
- initialize Firebase Messaging
- get FCM token if allowed
- generate or retrieve local deviceId
- save local registration state
- create channel subscription from scanned QR
- mark onboarding as complete

### Registration state should include:
- deviceId
- nickname
- fcmToken
- platform
- permission state
- subscribed channels

---

## 5. Home Page

The Home page is the main landing page after onboarding.

### Home must show:
- subscribed channels as cards
- each card showing:
  - channel name or code
  - role badge
  - optional description
  - unread indicator if available

### Home top bar must include:
- page title
- "+" action to add a new channel
- optional settings action

### Home conditional UI:
- install PWA banner if not installed
- notification permission banner if permission not granted
- empty state if no channels

---

## 6. Add Channel

Users must be able to add additional channel subscriptions later.

### Entry point
- "+" action from Home

### Flow
1. Open add-channel page
2. Scan QR
3. Parse channelCode + role
4. Save subscription locally
5. Return to Home

### Rules
- do not duplicate same subscription unnecessarily
- allow same device to belong to multiple channels
- allow device to have different roles across channels

---

## 7. Channel Detail

When user taps a channel card:

### Show
- channel header
- role badge
- list of notifications for that channel

### If role = receiver
- display notifications only

### If role = sender
- display notifications
- display sender form

---

## 8. Notifications List

Each channel must show its own notification history.

### Notification item fields
- title
- body
- created date/time
- read/unread state if implemented

### Behavior
- sort latest first
- clean empty state if none exist
- allow local update when new foreground message arrives

---

## 9. Sender Flow

If user has sender role in a channel, show send UI.

### Sender UI fields
- title
- message body

### Actions
- send notification
- clear form after success

### Rules
- title required
- message required
- button disabled while sending
- show success toast/snackbar
- show error message on failure

---

## 10. Foreground Notification Handling

When app is open:
- listen for FCM messages
- show in-app feedback
- update relevant channel notifications if possible

---

## 11. Background Notification Handling

When app is in background:
- use firebase-messaging-sw.js
- show OS-level notification
- support click action
- open or focus app on click
- deep-link to channel when data is available

---

## 12. PWA Install Guidance

If app is not installed:

### On supported browsers
- show install CTA or prompt

### On iOS
- show friendly instructions for “Add to Home Screen”

---

## 13. Notification Permission Guidance

If notification permission is:
- default → show enable CTA
- denied → show instructions to re-enable via browser/device settings
- granted → no warning banner

---

## 14. Reset / Debug Utility

A simple local reset action is useful.

### Can be placed in Settings
- reset onboarding
- clear local subscriptions
- clear cached notifications

This is helpful during development and gameplay testing.

---

## 15. Mock-First Requirement

Even if backend sending is not fully wired yet, build mock-friendly interfaces so Codex can create:

- UI
- services
- routes
- local flows

without blocking on final backend infrastructure.

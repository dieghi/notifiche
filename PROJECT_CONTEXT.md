# PROJECT_CONTEXT.md

## Project Name

NotifyQR

## High-Level Goal

NotifyQR is a lightweight Angular PWA that lets people join notification channels using QR codes.

The app is designed for simple adult group games or playful coordination scenarios.
This is not an enterprise-grade secure messaging app.
It is intentionally simple and fun.

## Core Product Idea

Each QR code identifies a channel and a role.

Examples:

- receiver QR → joins a channel and receives notifications
- sender QR → joins a channel and is allowed to send notifications for that channel

The application must support both types of subscriptions.

## Main User Flow

### First App Launch
1. Welcome screen
2. QR scan
3. Parse channel info from QR
4. Nickname input
5. Confirm
6. Request notification permission
7. Register device for Firebase Messaging
8. Save local state
9. Enter Home

### Subsequent Launches
- Open Home directly
- Show subscribed channels as cards
- Show install-PWA guidance if needed
- Show notification-permission guidance if needed
- Allow adding new channels with “+”

## Home Behavior

The Home page must show:

- all joined channels
- role badge for each channel:
  - receiver
  - sender
- PWA install banner if not installed
- notification permission banner if not granted
- empty state if no channels exist

## Channel Detail Behavior

When opening a channel:

- show notification list for that channel

If role = receiver:
- only show notifications

If role = sender:
- show notifications
- show send form to create a new notification for that channel

## QR Rules

QR content must include at least:

- channel code
- role

Recommended format:

`myapp://channel?code=RISTORANTE_ROMA&role=receiver`

or

`myapp://channel?code=RISTORANTE_ROMA&role=sender`

## Platforms

- Android: supported through web/PWA push flow
- iOS: supported as installed PWA with proper user guidance
- Desktop: optional, but acceptable

## Scope Notes

This phase focuses mainly on:

- frontend Angular app
- PWA readiness
- Firebase receiving integration
- sender flow architecture
- mock or lightweight persistence
- clean structure ready for later backend integration

## Non-Goals

Do not build:

- complex auth
- enterprise permissions
- advanced admin panel
- heavy backend logic
- security-first architecture

Keep it pragmatic and fun.

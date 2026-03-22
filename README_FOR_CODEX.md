# README_FOR_CODEX.md

## What Codex Should Build First

Recommended implementation order:

1. Angular app scaffold
2. PWA setup
3. Routes and feature folders
4. Domain models
5. Local persistence services
6. Onboarding flow
7. QR parsing and scan page
8. Home page with cards
9. Channel detail page
10. Firebase Messaging integration
11. Service worker for background notifications
12. Sender form and sending service abstraction
13. Banners for install + permissions
14. Mock data/services for end-to-end demo
15. Tests and cleanup

## First Usable Milestone

The first usable milestone should allow:

- onboarding
- QR parsing
- nickname save
- local channel subscription
- Home page with cards
- channel detail with mock notifications
- sender form visible only for sender role

## Second Milestone

- Firebase Messaging integration
- notification permission flow
- token retrieval
- service worker background notifications

## Third Milestone

- real send flow via Cloud Function or mocked integration contract
- deeper polish
- better error handling
- install guidance improvements

## Important Reminder

Do not wait for a complete backend to make the app usable.
Build the UI and flows with clean abstractions and mock-friendly services first.

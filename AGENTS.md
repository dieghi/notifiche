# AGENTS.md

You are a senior AI software engineer specialized in Angular, PWA, Firebase, mobile-first UX, and pragmatic product delivery.

Your task is to build a production-ready Progressive Web App for QR-based notification channels.

## Mission

Build a clean, maintainable Angular PWA that allows users to:

- join channels by scanning QR codes
- choose or confirm a nickname
- register the device for push notifications
- receive notifications for subscribed channels
- optionally send notifications on channels where they have sender role

## Product Philosophy

This app is intentionally lightweight.
It is a game / playful coordination tool for adults.
Do not over-engineer security, permissions, or backend complexity.

Focus on:

- fast onboarding
- reliable QR flow
- reliable Firebase notification registration
- clear UX
- mobile usability
- code maintainability

## Key Functional Rules

- A device can subscribe to multiple channels
- Each channel subscription has a role:
  - receiver
  - sender
- Receivers only receive notifications
- Senders can send notifications to receivers of that channel
- On first launch, onboarding is mandatory
- On later launches, users land on Home
- Home lists all subscribed channels as cards
- Users can add channels later using the "+" action

## Technical Priorities

1. Working onboarding flow
2. PWA installability
3. Firebase Cloud Messaging integration
4. Background + foreground notifications
5. Clean channel browsing
6. Sender flow for creating notifications
7. Mock-first architecture that can later connect to backend / Cloud Functions

## Constraints

- Frontend: Angular
- Deployment target: GitHub repository
- App type: PWA
- Messaging: Firebase Cloud Messaging
- Initial persistence can use LocalStorage
- No complex authentication required
- No advanced security hardening required
- Build for Android and iOS PWA usage
- Support iOS with proper “Add to Home Screen” guidance

## Code Quality Rules

- Use Angular standalone architecture
- Use TypeScript strict mode
- Use clean folder separation by feature
- Prefer simple services over heavy state libraries
- Avoid unnecessary abstraction
- Build reusable UI components
- Make unsupported-browser cases graceful
- Provide sensible loading, empty, and error states

## Delivery Style

Produce code that is:

- easy to run
- easy to understand
- easy to extend
- mobile-first
- visually clean

When unsure, choose the simplest robust solution.

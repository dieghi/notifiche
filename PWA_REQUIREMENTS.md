# PWA_REQUIREMENTS.md

## Goal

Build NotifyQR as a true installable Progressive Web App with a mobile-first experience.

## Must-Have PWA Features

- `manifest.webmanifest`
- icons for installable app
- standalone display mode
- theme color
- background color
- Angular Service Worker
- offline-ready shell for core app
- install guidance UX
- notification-permission guidance UX

## Installability Requirements

The app must detect and communicate install state.

### Required behavior
- detect whether app is already installed
- detect install prompt availability where supported
- expose install action on supported browsers
- show manual instructions where native prompt is not available

## iOS Requirements

Because iOS install behavior differs, add dedicated UX for:

- Safari guidance
- “Add to Home Screen” explanation
- clear install steps when needed

## App Shell Requirements

The app should cache enough assets to:
- load the shell offline
- show basic navigation and UI
- avoid blank screens on poor networks

Do not over-complicate offline sync in the first phase.

## Manifest Requirements

The manifest should include:

- app name
- short name
- start URL
- display = standalone
- theme color
- background color
- icon set

## Banner Requirements

Create reusable components for:

- install PWA banner
- notification permission banner

These banners should be compact, friendly, and mobile-friendly.

## UX Principles

- never aggressively force install
- clearly explain benefits
- keep install instructions lightweight
- avoid blocking the main app if install is skipped

## Testing Expectations

PWA behavior should be testable on:
- Android Chrome
- iPhone Safari installed to Home Screen
- desktop browser where available

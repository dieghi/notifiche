# UI_UX_GUIDELINES.md

## Design Goal

Build a clean, modern, lightweight, mobile-first interface that feels app-like and friendly.

The app is for a casual adult game / playful use case.
The design should feel simple, clear, and slightly playful, but not childish.

## Core Principles

- mobile-first
- clean spacing
- card-based information
- fast comprehension
- minimal friction
- clear call-to-action buttons
- obvious role distinction

## Visual Style

Use Angular Material with light customization.

Desired feeling:
- modern
- soft
- clean
- rounded cards
- readable typography
- clear hierarchy

## Main Screens

### Welcome
- friendly onboarding tone
- one main CTA
- simple illustration or icon optional

### QR Scan
- camera area prominent
- concise instructions
- fallback / retry UI
- invalid QR error state

### Nickname
- simple form
- one input
- one primary CTA

### Home
- channel cards
- banners stacked cleanly when needed
- visible “+” action
- easy scanning of role and channel name

### Channel Detail
- clear header
- notification timeline/list
- sender form displayed only when relevant

## Channel Cards

Each channel card should show:

- channel display name or code
- role badge
- optional short description
- optional unread indicator
- clean tap target
- subtle elevation / rounded appearance

## Role Badge Rules

Use distinct styles for:

- receiver
- sender

Badges should be instantly readable.

## Sender Form UX

If current role is sender:
- show compact form
- title field
- message field
- primary send button
- disabled/loading state while sending
- success and error feedback

## Empty States

Provide friendly empty states for:
- no channels
- no notifications
- notifications unsupported
- invalid QR
- send failure

Each empty state should include a clear next action when possible.

## Feedback Patterns

Use:
- snackbars / toasts for small feedback
- inline validation errors for forms
- non-blocking banners for install / permissions
- loading indicators for async actions

## Accessibility

Keep accessibility reasonably good:
- sufficient contrast
- touch-friendly buttons
- readable font sizing
- semantic labels for forms and buttons

## Avoid

- cluttered screens
- deeply nested menus
- overly enterprise-looking layouts
- dark heavy dashboards
- too many actions on one screen

# NOTIFICATION_SENDER.md

## Goal

Enable sender-role users to send push notifications to all receiver-role devices subscribed to a specific channel.

This should be implemented with a lightweight architecture suitable for a casual adult game app.

## Role System

Each channel subscription must include one role:

- receiver
- sender

### Receiver
- can receive notifications for that channel
- cannot send

### Sender
- can send notifications to receivers of that channel
- can also see the channel notifications list

## Product Assumption

This app does not require heavy security or sophisticated authorization logic for this phase.

Keep the implementation simple and pragmatic.

## Frontend Requirements

Create a sender flow inside the channel detail screen.

### If role = sender
Show:
- title input
- message textarea
- send button

### If role = receiver
Hide sender form completely.

## Validation Rules

- title required
- message required
- trim input values
- disable send button while request is in progress

## UX Requirements

On send:
- show loading state
- show success snackbar/toast if notification is sent
- clear form on success
- show clear error message on failure

## Notification Sending Strategy

Use a lightweight backend integration.

Preferred approach:
- Firebase Cloud Functions

Alternative during early frontend development:
- mock sender service

## Cloud Function Contract

Create a callable or HTTP function that receives:

```ts
{
  channelCode: string;
  title: string;
  body: string;
}
```

The function should:
1. retrieve all subscriptions for `channelCode` with `role = receiver`
2. collect valid FCM tokens
3. send notification to those tokens
4. include a useful data payload

## Suggested Notification Payload

```json
{
  "notification": {
    "title": "Title",
    "body": "Message"
  },
  "data": {
    "channelCode": "QUEST_ROMA",
    "type": "channel-message"
  }
}
```

## Frontend Service

Create:

- `notification-sender.service.ts`

Responsibilities:
- validate payload
- call backend/Cloud Function
- return typed success/error response
- isolate sending logic from components

## Suggested UI Placement

Inside channel detail page:
- header
- role badge
- sender form if sender
- notification history below or above depending on UX choice

## Optional Data Model Additions

Suggested sender payload interface:

```ts
export interface SenderPayload {
  channelCode: string;
  title: string;
  body: string;
}
```

Suggested result interface:

```ts
export interface SendNotificationResult {
  success: boolean;
  sentCount?: number;
  error?: string;
}
```

## Firestore / Storage Suggestion (If Used Later)

If using Firestore later, a simple structure could be:

- `devices`
- `subscriptions`
- `notifications`

Where subscriptions include:
- deviceId
- channelCode
- role
- token

This is just a suggested direction, not mandatory for the first implementation.

## Future Extensions

Possible future improvements:
- scheduled notifications
- images
- message templates
- sender nickname display
- channel metadata
- channel owners/admins

Do not implement these now unless explicitly requested.

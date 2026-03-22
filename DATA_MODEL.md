# DATA_MODEL.md

## Overview

This document defines the core domain models for NotifyQR.

Use TypeScript interfaces and clear naming.

---

## ChannelRole

```ts
export type ChannelRole = 'receiver' | 'sender';
```

---

## Channel

Represents a logical channel that users can subscribe to.

```ts
export interface Channel {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
}
```

Notes:
- `code` is the main QR-driven identifier
- `name` can initially match `code` if no extra data exists

---

## ChannelSubscription

Represents a device subscription to a channel with a role.

```ts
export interface ChannelSubscription {
  id: string;
  deviceId: string;
  channelCode: string;
  role: ChannelRole;
  joinedAt: string;
}
```

Rules:
- a device may have multiple subscriptions
- each subscription belongs to one channel
- role determines UI behavior and send permission

---

## DeviceRegistration

Represents the local device/app registration state.

```ts
export interface DeviceRegistration {
  deviceId: string;
  nickname: string;
  fcmToken?: string;
  platform: string;
  notificationPermission: NotificationPermission | 'unsupported';
  isPwaInstalled: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}
```

---

## NotificationItem

Represents a single notification displayed in a channel timeline.

```ts
export interface NotificationItem {
  id: string;
  channelCode: string;
  title: string;
  body: string;
  createdAt: string;
  read?: boolean;
  imageUrl?: string;
  senderNickname?: string;
  data?: Record<string, string>;
}
```

---

## ParsedQrPayload

Represents data parsed from a QR code.

```ts
export interface ParsedQrPayload {
  channelCode: string;
  role: ChannelRole;
}
```

---

## SenderPayload

Represents frontend payload for creating a notification.

```ts
export interface SenderPayload {
  channelCode: string;
  title: string;
  body: string;
}
```

---

## SendNotificationResult

Represents response from notification sending action.

```ts
export interface SendNotificationResult {
  success: boolean;
  sentCount?: number;
  error?: string;
}
```

---

## LocalAppState

Optional aggregate local persistence shape.

```ts
export interface LocalAppState {
  registration: DeviceRegistration | null;
  subscriptions: ChannelSubscription[];
  notifications: NotificationItem[];
}
```

---

## Suggested Local Storage Keys

```ts
export const STORAGE_KEYS = {
  registration: 'notifyqr.registration',
  subscriptions: 'notifyqr.subscriptions',
  notifications: 'notifyqr.notifications',
  pendingQr: 'notifyqr.pendingQr'
} as const;
```

---

## Recommended Validation Rules

### nickname
- required
- trimmed
- non-empty
- basic max length

### QR role
- must be `receiver` or `sender`

### channelCode
- required
- trimmed
- uppercase normalization optional

### sender payload
- title required
- body required

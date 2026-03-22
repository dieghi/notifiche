export type ChannelRole = 'receiver' | 'sender';

export interface Channel {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  createdAt?: string;
}

export interface ChannelSubscription {
  id: string;
  deviceId: string;
  channelCode: string;
  role: ChannelRole;
  joinedAt: string;
}

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

export interface ParsedQrPayload {
  channelCode: string;
  role: ChannelRole;
}

export interface SenderPayload {
  channelCode: string;
  title: string;
  body: string;
}

export interface SendNotificationResult {
  success: boolean;
  sentCount?: number;
  error?: string;
}

export interface LocalAppState {
  registration: DeviceRegistration | null;
  subscriptions: ChannelSubscription[];
  notifications: NotificationItem[];
}

export interface MessagingSetupResult {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  token?: string;
  error?: string;
  vapidConfigured?: boolean;
}

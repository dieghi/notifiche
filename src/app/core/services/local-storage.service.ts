import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ChannelSubscription,
  DeviceRegistration,
  NotificationItem,
  ParsedQrPayload
} from '../models/app.models';
import { STORAGE_KEYS } from '../models/storage-keys';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  getRegistration(): DeviceRegistration | null {
    return this.read<DeviceRegistration>(STORAGE_KEYS.registration);
  }

  setRegistration(registration: DeviceRegistration): void {
    this.write(STORAGE_KEYS.registration, registration);
  }

  getSubscriptions(): ChannelSubscription[] {
    return this.read<ChannelSubscription[]>(STORAGE_KEYS.subscriptions) ?? [];
  }

  setSubscriptions(subscriptions: ChannelSubscription[]): void {
    this.write(STORAGE_KEYS.subscriptions, subscriptions);
  }

  getNotifications(): NotificationItem[] {
    return this.read<NotificationItem[]>(STORAGE_KEYS.notifications) ?? [];
  }

  setNotifications(notifications: NotificationItem[]): void {
    this.write(STORAGE_KEYS.notifications, notifications);
  }

  getPendingQr(): ParsedQrPayload | null {
    return this.read<ParsedQrPayload>(STORAGE_KEYS.pendingQr);
  }

  setPendingQr(payload: ParsedQrPayload | null): void {
    if (!payload) {
      this.remove(STORAGE_KEYS.pendingQr);
      return;
    }

    this.write(STORAGE_KEYS.pendingQr, payload);
  }

  getPendingNickname(): string {
    return this.read<string>(STORAGE_KEYS.pendingNickname) ?? '';
  }

  setPendingNickname(nickname: string | null): void {
    if (!nickname) {
      this.remove(STORAGE_KEYS.pendingNickname);
      return;
    }

    this.write(STORAGE_KEYS.pendingNickname, nickname.trim());
  }

  clearAll(): void {
    if (!this.isBrowser()) {
      return;
    }

    Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
  }

  private read<T>(key: string): T | null {
    if (!this.isBrowser()) {
      return null;
    }

    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as T;
    } catch {
      return null;
    }
  }

  private write(key: string, value: unknown): void {
    if (!this.isBrowser()) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }

  private remove(key: string): void {
    if (!this.isBrowser()) {
      return;
    }

    window.localStorage.removeItem(key);
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

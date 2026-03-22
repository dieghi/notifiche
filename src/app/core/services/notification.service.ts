import { Injectable, computed, signal } from '@angular/core';
import { NotificationItem } from '../models/app.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsState = signal<NotificationItem[]>([]);

  readonly notifications = this.notificationsState.asReadonly();
  readonly groupedByChannel = computed(() => {
    const map = new Map<string, NotificationItem[]>();

    this.notificationsState().forEach((notification) => {
      const current = map.get(notification.channelCode) ?? [];
      map.set(notification.channelCode, [...current, notification]);
    });

    return map;
  });

  constructor(private readonly storage: LocalStorageService) {
    this.notificationsState.set(this.sort(this.storage.getNotifications()));
  }

  listByChannel(channelCode: string): NotificationItem[] {
    return this.sort(
      this.notificationsState().filter((notification) => notification.channelCode === channelCode)
    );
  }

  add(notification: NotificationItem): void {
    const updated = this.sort([notification, ...this.notificationsState()]);
    this.notificationsState.set(updated);
    this.storage.setNotifications(updated);
  }

  seedChannelIfEmpty(channelCode: string): void {
    if (this.listByChannel(channelCode).length > 0) {
      return;
    }

    this.add({
      id: crypto.randomUUID(),
      channelCode,
      title: 'Canale attivato',
      body: 'Sei pronto a ricevere messaggi su questo canale.',
      createdAt: new Date().toISOString(),
      read: true,
      senderNickname: 'NotifyQR'
    });
  }

  clear(): void {
    this.notificationsState.set([]);
    this.storage.setNotifications([]);
  }

  private sort(notifications: NotificationItem[]): NotificationItem[] {
    return [...notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
}

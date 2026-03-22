import { Injectable, computed, signal } from '@angular/core';
import { Channel, ChannelSubscription, ParsedQrPayload } from '../models/app.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private readonly subscriptionsState = signal<ChannelSubscription[]>([]);

  readonly subscriptions = this.subscriptionsState.asReadonly();
  readonly channels = computed(() =>
    this.subscriptionsState().map((subscription) => ({
      subscription,
      channel: this.buildChannel(subscription.channelCode)
    }))
  );

  constructor(private readonly storage: LocalStorageService) {
    this.subscriptionsState.set(this.storage.getSubscriptions());
  }

  addSubscription(payload: ParsedQrPayload, deviceId: string): ChannelSubscription {
    const existing = this.subscriptionsState().find(
      (subscription) =>
        subscription.channelCode === payload.channelCode && subscription.role === payload.role
    );

    if (existing) {
      return existing;
    }

    const subscription: ChannelSubscription = {
      id: crypto.randomUUID(),
      deviceId,
      channelCode: payload.channelCode,
      role: payload.role,
      joinedAt: new Date().toISOString()
    };

    const updated = [subscription, ...this.subscriptionsState()];
    this.subscriptionsState.set(updated);
    this.storage.setSubscriptions(updated);
    return subscription;
  }

  getByChannelCode(channelCode: string): { subscription: ChannelSubscription; channel: Channel } | null {
    const subscription = this.subscriptionsState().find((item) => item.channelCode === channelCode);
    if (!subscription) {
      return null;
    }

    return {
      subscription,
      channel: this.buildChannel(subscription.channelCode)
    };
  }

  clear(): void {
    this.subscriptionsState.set([]);
    this.storage.setSubscriptions([]);
  }

  private buildChannel(channelCode: string): Channel {
    return {
      id: channelCode,
      code: channelCode,
      name: channelCode
        .split('_')
        .map((segment) => segment.charAt(0) + segment.slice(1).toLowerCase())
        .join(' '),
      description: 'Canale pronto per notifiche rapide e QR.'
    };
  }
}

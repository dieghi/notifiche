import { Injectable } from '@angular/core';
import {
  NotificationItem,
  SenderPayload,
  SendNotificationResult
} from '../models/app.models';
import { DeviceRegistrationService } from './device-registration.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class NotificationSenderService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly registrationService: DeviceRegistrationService
  ) {}

  async send(payload: SenderPayload): Promise<SendNotificationResult> {
    const title = payload.title.trim();
    const body = payload.body.trim();

    if (!title || !body) {
      return {
        success: false,
        error: 'Titolo e messaggio sono obbligatori.'
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const notification: NotificationItem = {
      id: crypto.randomUUID(),
      channelCode: payload.channelCode,
      title,
      body,
      createdAt: new Date().toISOString(),
      read: true,
      senderNickname: this.registrationService.nickname() || 'Tu',
      data: {
        channelCode: payload.channelCode,
        type: 'channel-message'
      }
    };

    this.notificationService.add(notification);

    return {
      success: true,
      sentCount: 1
    };
  }
}

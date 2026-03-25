import { Injectable } from '@angular/core';
import { httpsCallable } from 'firebase/functions';
import {
  NotificationItem,
  SenderPayload,
  SendNotificationResult
} from '../models/app.models';
import { DeviceRegistrationService } from './device-registration.service';
import { FirebaseAppService } from './firebase-app.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class NotificationSenderService {
  constructor(
    private readonly firebaseAppService: FirebaseAppService,
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

    const registration = this.registrationService.registration();
    if (!registration) {
      return {
        success: false,
        error: 'Registrazione dispositivo non trovata.'
      };
    }

    try {
      const sendChannelNotification = httpsCallable<
        SenderPayload & { senderDeviceId: string; senderNickname: string },
        { success: boolean; sentCount?: number; storedNotificationId?: string }
      >(this.firebaseAppService.functions, 'sendChannelNotification');

      const response = await sendChannelNotification({
        channelCode: payload.channelCode,
        title,
        body,
        senderDeviceId: registration.deviceId,
        senderNickname: this.registrationService.nickname() || 'Tu'
      });

      const notification: NotificationItem = {
        id: response.data.storedNotificationId ?? crypto.randomUUID(),
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
        success: response.data.success,
        sentCount: response.data.sentCount ?? 0
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Invio reale non riuscito. Controlla che Cloud Functions sia deployata."
      };
    }
  }
}

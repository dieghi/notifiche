import { Injectable } from '@angular/core';
import { getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';
import { environment } from '../../../environments/environment';
import { MessagingSetupResult } from '../models/app.models';
import { FirebaseAppService } from './firebase-app.service';

@Injectable({ providedIn: 'root' })
export class FirebaseMessagingService {
  private messagingInstance?: Messaging;
  private alreadyInitializedForegroundListener = false;
  private messagingSwRegistration?: ServiceWorkerRegistration;

  readonly firebaseProjectId = environment.firebase.projectId;

  constructor(private readonly firebaseAppService: FirebaseAppService) {}

  async setupMessaging(
    onForegroundMessage?: (payload: { title: string; body: string; data?: Record<string, string> }) => void
  ): Promise<MessagingSetupResult> {
    if (typeof window === 'undefined' || typeof Notification === 'undefined') {
      return {
        supported: false,
        permission: 'unsupported',
        error: 'Notifiche non supportate in questo contesto.',
        vapidConfigured: this.hasConfiguredVapidKey()
      };
    }

    const supported = await isSupported().catch(() => false);
    if (!supported) {
      return {
        supported: false,
        permission: 'unsupported',
        error: 'Firebase Messaging non e supportato su questo dispositivo.',
        vapidConfigured: this.hasConfiguredVapidKey()
      };
    }

    if (!this.messagingInstance) {
      const module = await import('firebase/messaging');
      this.messagingInstance = module.getMessaging(this.firebaseAppService.app);
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        supported: true,
        permission,
        vapidConfigured: this.hasConfiguredVapidKey()
      };
    }

    if (!this.hasConfiguredVapidKey()) {
      return {
        supported: true,
        permission,
        vapidConfigured: false,
        error:
          'Manca la VAPID key pubblica del progetto Firebase. Inseriscila negli environment prima di richiedere il token.'
      };
    }

    if (onForegroundMessage && !this.alreadyInitializedForegroundListener) {
      onMessage(this.messagingInstance, (payload) => {
        onForegroundMessage({
          title: payload.notification?.title ?? 'Nuova notifica',
          body: payload.notification?.body ?? '',
          data: (payload.data as Record<string, string> | undefined) ?? undefined
        });
      });
      this.alreadyInitializedForegroundListener = true;
    }

    let token: string | undefined;

    try {
      if (!this.messagingSwRegistration) {
        const serviceWorkerUrl = new URL('firebase-messaging-sw.js', document.baseURI).toString();
        const serviceWorkerScope = new URL(
          'firebase-cloud-messaging-push-scope/',
          document.baseURI
        ).pathname;

        this.messagingSwRegistration = await navigator.serviceWorker.register(
          serviceWorkerUrl,
          {
            scope: serviceWorkerScope
          }
        );
      }

      token = await getToken(this.messagingInstance, {
        vapidKey:
          environment.firebaseMessaging.vapidKey === 'REPLACE_WITH_PUBLIC_VAPID_KEY'
            ? undefined
            : environment.firebaseMessaging.vapidKey,
        serviceWorkerRegistration: this.messagingSwRegistration
      });
    } catch (error) {
      return {
        supported: true,
        permission,
        error: error instanceof Error ? error.message : 'Impossibile ottenere il token FCM.'
      };
    }

    return {
      supported: true,
      permission,
      token,
      vapidConfigured: true
    };
  }

  hasConfiguredVapidKey(): boolean {
    return Boolean(
      environment.firebaseMessaging.vapidKey &&
        environment.firebaseMessaging.vapidKey !== 'REPLACE_WITH_PUBLIC_VAPID_KEY'
    );
  }
}

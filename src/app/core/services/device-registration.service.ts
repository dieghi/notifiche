import { Injectable, computed, signal } from '@angular/core';
import {
  DeviceRegistration,
  MessagingSetupResult,
  ParsedQrPayload
} from '../models/app.models';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class DeviceRegistrationService {
  private readonly registrationState = signal<DeviceRegistration | null>(null);

  readonly registration = this.registrationState.asReadonly();
  readonly isOnboardingCompleted = computed(
    () => this.registrationState()?.onboardingCompleted ?? false
  );
  readonly nickname = computed(() => this.registrationState()?.nickname ?? '');
  readonly notificationPermission = computed(
    () => this.registrationState()?.notificationPermission ?? 'default'
  );

  constructor(private readonly storage: LocalStorageService) {
    this.registrationState.set(this.storage.getRegistration());
  }

  getDeviceId(): string {
    return this.registrationState()?.deviceId ?? this.generateDeviceId();
  }

  completeOnboarding(
    nickname: string,
    isPwaInstalled: boolean,
    messagingResult: MessagingSetupResult
  ): DeviceRegistration {
    const now = new Date().toISOString();
    const current = this.registrationState();

    const registration: DeviceRegistration = {
      deviceId: current?.deviceId ?? this.generateDeviceId(),
      nickname: nickname.trim(),
      fcmToken: messagingResult.token,
      platform: this.detectPlatform(),
      notificationPermission: messagingResult.permission,
      isPwaInstalled,
      onboardingCompleted: true,
      createdAt: current?.createdAt ?? now,
      updatedAt: now
    };

    this.registrationState.set(registration);
    this.storage.setRegistration(registration);
    return registration;
  }

  updateMessagingState(messagingResult: MessagingSetupResult, isPwaInstalled: boolean): void {
    const current = this.registrationState();
    if (!current) {
      return;
    }

    const updated: DeviceRegistration = {
      ...current,
      fcmToken: messagingResult.token ?? current.fcmToken,
      notificationPermission: messagingResult.permission,
      isPwaInstalled,
      updatedAt: new Date().toISOString()
    };

    this.registrationState.set(updated);
    this.storage.setRegistration(updated);
  }

  updateNickname(nickname: string): void {
    const current = this.registrationState();
    if (!current) {
      return;
    }

    const updated: DeviceRegistration = {
      ...current,
      nickname: nickname.trim(),
      updatedAt: new Date().toISOString()
    };

    this.registrationState.set(updated);
    this.storage.setRegistration(updated);
  }

  savePendingQr(payload: ParsedQrPayload | null): void {
    this.storage.setPendingQr(payload);
  }

  getPendingQr(): ParsedQrPayload | null {
    return this.storage.getPendingQr();
  }

  savePendingNickname(nickname: string | null): void {
    this.storage.setPendingNickname(nickname);
  }

  getPendingNickname(): string {
    return this.storage.getPendingNickname();
  }

  reset(): void {
    this.registrationState.set(null);
    this.storage.clearAll();
  }

  private generateDeviceId(): string {
    const deviceId = crypto.randomUUID();
    return deviceId;
  }

  private detectPlatform(): string {
    if (typeof navigator === 'undefined') {
      return 'server';
    }

    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'ios';
    }
    if (/android/.test(userAgent)) {
      return 'android';
    }

    return 'web';
  }
}

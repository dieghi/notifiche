import { Injectable } from '@angular/core';
import { httpsCallable } from 'firebase/functions';
import { ChannelSubscription, DeviceRegistration } from '../models/app.models';
import { FirebaseAppService } from './firebase-app.service';

@Injectable({ providedIn: 'root' })
export class FirebaseCloudSyncService {
  constructor(private readonly firebaseAppService: FirebaseAppService) {}

  async syncDeviceState(
    registration: DeviceRegistration,
    subscriptions: ChannelSubscription[]
  ): Promise<void> {
    const syncDeviceState = httpsCallable<
      {
        registration: DeviceRegistration;
        subscriptions: ChannelSubscription[];
      },
      { success: boolean; syncedSubscriptions: number }
    >(this.firebaseAppService.functions, 'syncDeviceState');

    await syncDeviceState({
      registration,
      subscriptions
    });
  }
}

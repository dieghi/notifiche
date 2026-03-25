import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChannelService } from '../../../core/services/channel.service';
import { DeviceRegistrationService } from '../../../core/services/device-registration.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FirebaseCloudSyncService } from '../../../core/services/firebase-cloud-sync.service';
import { ParsedQrPayload } from '../../../core/models/app.models';
import { QrScannerComponent } from '../../../shared/components/qr-scanner.component';

@Component({
  standalone: true,
  imports: [QrScannerComponent, MatSnackBarModule],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <header class="page-header">
          <h1>Aggiungi un canale</h1>
          <p>Scansiona un nuovo QR per aggiungere un canale al dispositivo corrente.</p>
        </header>

        <app-qr-scanner (parsed)="addChannel($event)" />
      </div>
    </div>
  `
})
export class AddChannelPage {
  constructor(
    private readonly channelService: ChannelService,
    private readonly notificationService: NotificationService,
    private readonly registrationService: DeviceRegistrationService,
    private readonly firebaseCloudSyncService: FirebaseCloudSyncService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  async addChannel(payload: ParsedQrPayload): Promise<void> {
    this.channelService.addSubscription(payload, this.registrationService.getDeviceId());
    this.notificationService.seedChannelIfEmpty(payload.channelCode);
    const registration = this.registrationService.registration();
    if (registration) {
      try {
        await this.firebaseCloudSyncService.syncDeviceState(
          registration,
          this.channelService.subscriptions()
        );
      } catch {
        this.snackBar.open('Canale salvato in locale. La sincronizzazione cloud non e riuscita.', 'Chiudi', {
          duration: 3000
        });
      }
    }
    this.snackBar.open('Canale aggiunto.', 'Chiudi', { duration: 2000 });
    void this.router.navigate(['/channels', payload.channelCode]);
  }
}

import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChannelService } from '../../../core/services/channel.service';
import { DeviceRegistrationService } from '../../../core/services/device-registration.service';
import { FirebaseMessagingService } from '../../../core/services/firebase-messaging.service';
import { NotificationService } from '../../../core/services/notification.service';
import { PwaService } from '../../../core/services/pwa.service';
import { RoleBadgeComponent } from '../../../shared/components/role-badge.component';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSnackBarModule, RoleBadgeComponent],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <header class="page-header">
          <h1>Conferma iscrizione</h1>
          <p>Ultimo passaggio: salviamo il tuo profilo locale e prepariamo le notifiche push.</p>
        </header>

        @if (pendingQr(); as qr) {
          <mat-card class="surface-card confirm-card">
            <div class="summary-row">
              <div>
                <span class="label">Canale</span>
                <strong>{{ qr.channelCode }}</strong>
              </div>
              <app-role-badge [role]="qr.role" />
            </div>
            <div class="summary-row">
              <div>
                <span class="label">Nickname</span>
                <strong>{{ nickname() }}</strong>
              </div>
            </div>
            <button mat-flat-button color="primary" type="button" (click)="complete()" [disabled]="loading()">
              {{ loading() ? 'Configurazione in corso...' : 'Completa onboarding' }}
            </button>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-card {
        display: grid;
        gap: 18px;
        padding: 20px;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      .label {
        display: block;
        margin-bottom: 4px;
        color: #5c667a;
      }
    `
  ]
})
export class ConfirmPage {
  readonly loading = signal(false);
  readonly pendingQr = computed(() => this.registrationService.getPendingQr());
  readonly nickname = computed(
    () => sessionStorage.getItem('notifyqr.pendingNickname') || this.registrationService.nickname()
  );

  constructor(
    private readonly registrationService: DeviceRegistrationService,
    private readonly messagingService: FirebaseMessagingService,
    private readonly channelService: ChannelService,
    private readonly notificationService: NotificationService,
    private readonly pwaService: PwaService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router
  ) {}

  async complete(): Promise<void> {
    const pendingQr = this.pendingQr();
    const nickname = this.nickname().trim();

    if (!pendingQr || !nickname) {
      void this.router.navigate(['/onboarding/nickname']);
      return;
    }

    this.loading.set(true);

    const messagingResult = await this.messagingService.setupMessaging((payload) => {
      if (!payload.data?.['channelCode']) {
        return;
      }

      this.notificationService.add({
        id: crypto.randomUUID(),
        channelCode: payload.data['channelCode'],
        title: payload.title,
        body: payload.body,
        createdAt: new Date().toISOString(),
        read: false,
        data: payload.data
      });
    });

    const registration = this.registrationService.completeOnboarding(
      nickname,
      this.pwaService.isInstalled(),
      messagingResult
    );

    this.channelService.addSubscription(pendingQr, registration.deviceId);
    this.notificationService.seedChannelIfEmpty(pendingQr.channelCode);
    this.registrationService.savePendingQr(null);
    sessionStorage.removeItem('notifyqr.pendingNickname');

    this.loading.set(false);
    this.snackBar.open('Onboarding completato.', 'Chiudi', { duration: 2500 });
    void this.router.navigate(['/home']);
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChannelService } from '../../core/services/channel.service';
import { DeviceRegistrationService } from '../../core/services/device-registration.service';
import { FirebaseMessagingService } from '../../core/services/firebase-messaging.service';
import { FirebaseTestingGuideService } from '../../core/services/firebase-testing-guide.service';
import { NotificationService } from '../../core/services/notification.service';
import { PwaService } from '../../core/services/pwa.service';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatSnackBarModule, MatIconModule],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <header class="page-header">
          <h1>Impostazioni</h1>
          <p>Qui controlliamo lo stato reale di Firebase Messaging e prepariamo il primo test live.</p>
        </header>

        <mat-card class="surface-card settings-card">
          <div class="info-row">
            <span>Nickname attuale</span>
            <strong>{{ registrationService.nickname() || 'non impostato' }}</strong>
          </div>
          <div class="info-row">
            <span>Permesso notifiche</span>
            <strong>{{ registrationService.notificationPermission() }}</strong>
          </div>
          <div class="info-row">
            <span>Progetto Firebase</span>
            <strong>{{ messagingService.firebaseProjectId }}</strong>
          </div>
          <div class="info-row">
            <span>VAPID configurata</span>
            <strong>{{ messagingService.hasConfiguredVapidKey() ? 'Si' : 'No' }}</strong>
          </div>
          <div class="info-row">
            <span>Token FCM</span>
            <strong>{{ hasToken() ? 'Disponibile' : 'Non disponibile' }}</strong>
          </div>
        </mat-card>

        <mat-card class="surface-card settings-card">
          <div class="section-head">
            <div>
              <h2>Debug notifiche reali</h2>
              <p>Attiva il permesso, registra il service worker FCM e prova a generare un token reale.</p>
            </div>
            <mat-icon>notifications_active</mat-icon>
          </div>

          @if (lastError()) {
            <p class="error-box">{{ lastError() }}</p>
          }

          @if (!messagingService.hasConfiguredVapidKey()) {
            <p class="hint-box">
              Prima di tutto inserisci la public VAPID key del progetto Firebase negli environment.
            </p>
          }

          <div class="button-row">
            <button mat-flat-button color="primary" type="button" (click)="enableRealNotifications()">
              Attiva notifiche reali
            </button>
            <button
              mat-stroked-button
              type="button"
              (click)="copyToken()"
              [disabled]="!registrationService.registration()?.fcmToken"
            >
              Copia token FCM
            </button>
          </div>

          @if (registrationService.registration()?.fcmToken; as token) {
            <div class="token-box">
              <strong>Token FCM corrente</strong>
              <code>{{ token }}</code>
            </div>
          }
        </mat-card>

        <mat-card class="surface-card settings-card">
          <h2>Checklist test live</h2>
          <ol class="steps">
            @for (step of testingGuide.steps; track step) {
              <li>{{ step }}</li>
            }
          </ol>
          <p class="hint-box">
            Per vedere la notifica di sistema, lascia l’app in background quando invii il test.
          </p>
        </mat-card>

        <mat-card class="surface-card settings-card">
          <button mat-stroked-button type="button" (click)="reset()">
            Reset locale completo
          </button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-card {
        display: grid;
        gap: 16px;
        padding: 20px;
      }

      p,
      h2,
      ol {
        margin: 0;
      }

      .info-row,
      .button-row,
      .section-head {
        display: flex;
        gap: 12px;
        justify-content: space-between;
        align-items: center;
      }

      .button-row {
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      .section-head {
        align-items: flex-start;
      }

      .section-head h2 {
        margin-bottom: 6px;
      }

      .token-box,
      .hint-box,
      .error-box {
        padding: 14px;
        border-radius: 16px;
      }

      .token-box {
        background: #f4f7fd;
      }

      .hint-box {
        background: #fff8ea;
        color: #7a5a15;
      }

      .error-box {
        background: #fdecec;
        color: #a62f2f;
      }

      code {
        display: block;
        margin-top: 8px;
        white-space: pre-wrap;
        word-break: break-all;
      }

      .steps {
        padding-left: 20px;
      }
    `
  ]
})
export class SettingsPage {
  readonly registrationService = inject(DeviceRegistrationService);
  readonly messagingService = inject(FirebaseMessagingService);
  readonly testingGuide = inject(FirebaseTestingGuideService);
  private readonly pwaService = inject(PwaService);
  private readonly channelService = inject(ChannelService);
  private readonly notificationService = inject(NotificationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly lastMessagingErrorState = signal('');

  readonly hasToken = computed(() => Boolean(this.registrationService.registration()?.fcmToken));
  readonly lastError = computed(
    () => (this.registrationService.registration()?.fcmToken ? '' : this.lastMessagingErrorState())
  );

  async enableRealNotifications(): Promise<void> {
    const result = await this.messagingService.setupMessaging((payload) => {
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

    this.lastMessagingErrorState.set(result.error ?? '');
    this.registrationService.updateMessagingState(result, this.pwaService.isInstalled());

    this.snackBar.open(
      result.token
        ? 'Token FCM ottenuto correttamente.'
        : result.error || 'Token non disponibile.',
      'Chiudi',
      { duration: 3500 }
    );
  }

  async copyToken(): Promise<void> {
    const token = this.registrationService.registration()?.fcmToken;
    if (!token) {
      return;
    }

    try {
      await navigator.clipboard.writeText(token);
      this.snackBar.open('Token copiato negli appunti.', 'Chiudi', { duration: 2000 });
    } catch {
      this.snackBar.open('Clipboard non disponibile su questo browser.', 'Chiudi', {
        duration: 2500
      });
    }
  }

  reset(): void {
    this.channelService.clear();
    this.notificationService.clear();
    this.registrationService.reset();
    this.snackBar.open('Dati locali rimossi.', 'Chiudi', { duration: 2000 });
    void this.router.navigate(['/onboarding/welcome']);
  }
}

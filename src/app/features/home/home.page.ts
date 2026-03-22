import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChannelService } from '../../core/services/channel.service';
import { DeviceRegistrationService } from '../../core/services/device-registration.service';
import { FirebaseMessagingService } from '../../core/services/firebase-messaging.service';
import { NotificationService } from '../../core/services/notification.service';
import { PwaService } from '../../core/services/pwa.service';
import { ChannelCardComponent } from '../../shared/components/channel-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { InstallPwaBannerComponent } from '../../shared/components/install-pwa-banner.component';
import { NotificationPermissionBannerComponent } from '../../shared/components/notification-permission-banner.component';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    ChannelCardComponent,
    EmptyStateComponent,
    InstallPwaBannerComponent,
    NotificationPermissionBannerComponent
  ],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <mat-toolbar color="transparent" class="toolbar">
          <span>NotifyQR</span>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button routerLink="/settings" aria-label="Apri impostazioni">
            <mat-icon>settings</mat-icon>
          </button>
        </mat-toolbar>

        <header class="page-header">
          <h1>Ciao {{ nickname() || 'giocatore' }}</h1>
          <p>I tuoi canali sono pronti. Puoi aggiungerne altri in qualsiasi momento.</p>
        </header>

        @if (showInstallBanner()) {
          <app-install-pwa-banner
            [iosMode]="pwaService.showIosInstructions()"
            [showAction]="pwaService.canInstall()"
            (install)="installPwa()"
          />
        }

        @if (showPermissionBanner()) {
          <app-notification-permission-banner
            [permission]="notificationPermission()"
            (enable)="enableNotifications()"
          />
        }

        @if (channels().length === 0) {
          <app-empty-state
            icon="add_reaction"
            title="Nessun canale ancora"
            description="Scansiona un nuovo QR per iniziare a ricevere notifiche."
            actionLabel="Aggiungi canale"
            (action)="openAddChannel()"
          />
        } @else {
          <section class="stack">
            @for (item of channels(); track item.subscription.id) {
              <app-channel-card [channel]="item.channel" [subscription]="item.subscription" />
            }
          </section>
        }
      </div>

      <button
        mat-fab
        color="primary"
        class="floating-action"
        type="button"
        (click)="openAddChannel()"
        aria-label="Aggiungi canale"
      >
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
  styles: [
    `
      .toolbar {
        padding: 0;
        background: transparent;
      }

      .toolbar-spacer {
        flex: 1;
      }
    `
  ]
})
export class HomePage {
  readonly pwaService = inject(PwaService);
  private readonly channelService = inject(ChannelService);
  private readonly registrationService = inject(DeviceRegistrationService);
  private readonly messagingService = inject(FirebaseMessagingService);
  private readonly notificationService = inject(NotificationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  readonly channels = this.channelService.channels;
  readonly nickname = this.registrationService.nickname;
  readonly notificationPermission = this.registrationService.notificationPermission;
  readonly showInstallBanner = computed(
    () =>
      !this.pwaService.isInstalled() &&
      (this.pwaService.canInstall() || this.pwaService.showIosInstructions())
  );
  readonly showPermissionBanner = computed(
    () => this.notificationPermission() === 'default' || this.notificationPermission() === 'denied'
  );

  openAddChannel(): void {
    void this.router.navigate(['/channels/add']);
  }

  async installPwa(): Promise<void> {
    const installed = await this.pwaService.triggerInstall();
    if (installed) {
      this.snackBar.open('App installata con successo.', 'Chiudi', { duration: 2000 });
    }
  }

  async enableNotifications(): Promise<void> {
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

    this.registrationService.updateMessagingState(result, this.pwaService.isInstalled());
    this.snackBar.open(
      result.permission === 'granted'
        ? 'Notifiche attivate.'
        : 'Permesso notifiche non concesso.',
      'Chiudi',
      { duration: 2500 }
    );
  }
}

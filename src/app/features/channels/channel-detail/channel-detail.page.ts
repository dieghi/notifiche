import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ChannelService } from '../../../core/services/channel.service';
import { NotificationService } from '../../../core/services/notification.service';
import { NotificationSenderService } from '../../../core/services/notification-sender.service';
import { SenderPayload } from '../../../core/models/app.models';
import { EmptyStateComponent } from '../../../shared/components/empty-state.component';
import { NotificationListItemComponent } from '../../../shared/components/notification-list-item.component';
import { RoleBadgeComponent } from '../../../shared/components/role-badge.component';
import { SenderFormComponent } from '../../../shared/components/sender-form.component';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    EmptyStateComponent,
    NotificationListItemComponent,
    RoleBadgeComponent,
    SenderFormComponent
  ],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <button mat-button routerLink="/home" type="button">
          <mat-icon>arrow_back</mat-icon>
          Torna alla home
        </button>

        @if (channelEntry(); as entry) {
          <header class="channel-header">
            <div>
              <p class="eyebrow">Canale</p>
              <h1>{{ entry.channel.name }}</h1>
              <p>{{ entry.channel.description }}</p>
            </div>
            <app-role-badge [role]="entry.subscription.role" />
          </header>

          @if (entry.subscription.role === 'sender') {
            <app-sender-form
              #senderForm
              [channelCode]="entry.channel.code"
              [sending]="sending()"
              (sendPayload)="send($event)"
            />
          }

          <section class="stack">
            <div class="section-title">
              <h2>Notifiche</h2>
              <span>{{ notifications().length }}</span>
            </div>

            @if (notifications().length === 0) {
              <app-empty-state
                title="Nessuna notifica"
                description="Quando arriveranno nuovi messaggi li vedrai qui."
              />
            } @else {
              @for (notification of notifications(); track notification.id) {
                <app-notification-list-item [notification]="notification" />
              }
            }
          </section>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .channel-header {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
      }

      .eyebrow,
      .channel-header p,
      .section-title h2,
      .section-title span {
        margin: 0;
      }

      .eyebrow {
        color: #4465d8;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .section-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    `
  ]
})
export class ChannelDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly channelService = inject(ChannelService);
  private readonly notificationService = inject(NotificationService);
  private readonly notificationSenderService = inject(NotificationSenderService);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild('senderForm') senderForm?: SenderFormComponent;

  private readonly channelCode = this.route.snapshot.paramMap.get('channelCode') ?? '';

  readonly channelEntry = computed(() => this.channelService.getByChannelCode(this.channelCode));
  readonly notifications = computed(() => this.notificationService.listByChannel(this.channelCode));
  readonly sending = signal(false);

  async send(payload: SenderPayload): Promise<void> {
    this.sending.set(true);
    const result = await this.notificationSenderService.send(payload);
    this.sending.set(false);

    if (result.success) {
      this.senderForm?.reset();
      this.snackBar.open('Notifica inviata.', 'Chiudi', { duration: 2000 });
      return;
    }

    this.snackBar.open(result.error ?? 'Invio non riuscito.', 'Chiudi', { duration: 2500 });
  }
}

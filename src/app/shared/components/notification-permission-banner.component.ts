import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-permission-banner',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="banner">
      <div class="copy">
        <div class="title-row">
          <mat-icon>notifications_active</mat-icon>
          <strong>Notifiche</strong>
        </div>
        <p>
          @if (permission === 'denied') {
            Le notifiche sono disattivate. Riattivale dalle impostazioni del browser o del dispositivo.
          } @else if (permission === 'unsupported') {
            Questo dispositivo non supporta le notifiche push web.
          } @else {
            Attiva le notifiche per ricevere messaggi dai tuoi canali anche quando l'app e in background.
          }
        </p>
      </div>
      @if (permission === 'default' && showAction) {
        <button mat-flat-button color="primary" type="button" (click)="enable.emit()">
          Attiva ora
        </button>
      }
    </mat-card>
  `,
  styles: [
    `
      .banner {
        display: grid;
        gap: 12px;
        padding: 8px;
        border-radius: 20px;
        background: linear-gradient(135deg, #fff9ef, #ffffff);
      }

      .copy {
        display: grid;
        gap: 6px;
      }

      .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      p {
        margin: 0;
        color: #665c45;
      }
    `
  ]
})
export class NotificationPermissionBannerComponent {
  @Input() permission: NotificationPermission | 'unsupported' = 'default';
  @Input() showAction = true;
  @Output() enable = new EventEmitter<void>();
}

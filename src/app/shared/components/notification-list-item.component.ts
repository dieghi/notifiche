import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NotificationItem } from '../../core/models/app.models';

@Component({
  selector: 'app-notification-list-item',
  standalone: true,
  imports: [MatCardModule, DatePipe],
  template: `
    <mat-card class="notification-item">
      <div class="top-row">
        <h3>{{ notification.title }}</h3>
        <span>{{ notification.createdAt | date: 'dd/MM HH:mm' }}</span>
      </div>
      <p>{{ notification.body }}</p>
      @if (notification.senderNickname) {
        <small>Inviata da {{ notification.senderNickname }}</small>
      }
    </mat-card>
  `,
  styles: [
    `
      .notification-item {
        display: grid;
        gap: 8px;
        border-radius: 20px;
      }

      .top-row {
        display: flex;
        justify-content: space-between;
        gap: 12px;
      }

      h3,
      p,
      small {
        margin: 0;
      }

      p,
      small,
      span {
        color: #5d6475;
      }
    `
  ]
})
export class NotificationListItemComponent {
  @Input({ required: true }) notification!: NotificationItem;
}

import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Channel, ChannelSubscription } from '../../core/models/app.models';
import { RoleBadgeComponent } from './role-badge.component';

@Component({
  selector: 'app-channel-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, RouterLink, RoleBadgeComponent, DatePipe],
  template: `
    <a class="channel-link" [routerLink]="['/channels', channel.code]">
      <mat-card class="channel-card">
        <div class="channel-head">
          <div>
            <p class="eyebrow">Codice {{ channel.code }}</p>
            <h3>{{ channel.name }}</h3>
          </div>
          <app-role-badge [role]="subscription.role" />
        </div>
        <p class="description">{{ channel.description }}</p>
        <div class="channel-foot">
          <span>Iscritto dal {{ subscription.joinedAt | date: 'dd/MM/yyyy' }}</span>
          <mat-icon>chevron_right</mat-icon>
        </div>
      </mat-card>
    </a>
  `,
  styles: [
    `
      .channel-link {
        color: inherit;
        text-decoration: none;
      }

      .channel-card {
        display: grid;
        gap: 14px;
        border-radius: 24px;
        padding: 8px;
        background: #ffffff;
        box-shadow: 0 18px 30px rgba(31, 48, 86, 0.08);
      }

      .channel-head,
      .channel-foot {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .eyebrow,
      .description,
      .channel-foot {
        margin: 0;
        color: #5e667b;
      }

      h3 {
        margin: 4px 0 0;
      }
    `
  ]
})
export class ChannelCardComponent {
  @Input({ required: true }) channel!: Channel;
  @Input({ required: true }) subscription!: ChannelSubscription;
}

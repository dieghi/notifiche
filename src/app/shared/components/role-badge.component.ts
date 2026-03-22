import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { ChannelRole } from '../../core/models/app.models';

@Component({
  selector: 'app-role-badge',
  standalone: true,
  imports: [MatChipsModule],
  template: `
    <mat-chip [class.sender]="role === 'sender'" [class.receiver]="role === 'receiver'">
      {{ role === 'sender' ? 'Sender' : 'Receiver' }}
    </mat-chip>
  `,
  styles: [
    `
      .mat-mdc-chip {
        font-weight: 700;
      }

      .receiver {
        --mdc-chip-elevated-container-color: #e8f5e9;
        --mdc-chip-label-text-color: #205526;
      }

      .sender {
        --mdc-chip-elevated-container-color: #fff3e0;
        --mdc-chip-label-text-color: #8a4b00;
      }
    `
  ]
})
export class RoleBadgeComponent {
  @Input({ required: true }) role!: ChannelRole;
}

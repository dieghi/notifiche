import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <section class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      @if (actionLabel) {
        <button mat-flat-button color="primary" type="button" (click)="action.emit()">
          {{ actionLabel }}
        </button>
      }
    </section>
  `,
  styles: [
    `
      .empty-state {
        display: grid;
        gap: 12px;
        justify-items: center;
        text-align: center;
        padding: 28px 20px;
        border-radius: 24px;
        background: #ffffff;
        box-shadow: 0 14px 30px rgba(25, 45, 80, 0.08);
      }

      mat-icon {
        width: 40px;
        height: 40px;
        font-size: 40px;
        color: #4465d8;
      }

      h2,
      p {
        margin: 0;
      }

      p {
        color: #5a6275;
      }
    `
  ]
})
export class EmptyStateComponent {
  @Input() icon = 'notifications_off';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() actionLabel = '';
  @Output() action = new EventEmitter<void>();
}

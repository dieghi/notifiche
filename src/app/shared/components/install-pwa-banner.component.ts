import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-install-pwa-banner',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="banner">
      <div class="copy">
        <div class="title-row">
          <mat-icon>download</mat-icon>
          <strong>Installa NotifyQR</strong>
        </div>
        <p>
          @if (iosMode) {
            Apri il menu Condividi di Safari e scegli "Aggiungi alla schermata Home".
          } @else {
            Installa l'app per aprirla piu velocemente e usarla come una vera app.
          }
        </p>
      </div>
      @if (!iosMode && showAction) {
        <button mat-flat-button color="primary" type="button" (click)="install.emit()">
          Installa
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
        background: linear-gradient(135deg, #f4f8ff, #ffffff);
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
        color: #566074;
      }
    `
  ]
})
export class InstallPwaBannerComponent {
  @Input() iosMode = false;
  @Input() showAction = false;
  @Output() install = new EventEmitter<void>();
}

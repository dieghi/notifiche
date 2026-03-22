import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QrService } from '../../core/services/qr.service';
import { ParsedQrPayload } from '../../core/models/app.models';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  template: `
    <mat-card class="scanner-card">
      <div class="camera-mock">
        <mat-icon>qr_code_scanner</mat-icon>
        <strong>Scanner QR mock</strong>
        <p>Per questa prima versione puoi incollare il contenuto del QR oppure usare un esempio.</p>
      </div>

      <mat-form-field appearance="outline">
        <mat-label>Contenuto QR</mat-label>
        <textarea
          matInput
          rows="3"
          [formControl]="contentControl"
          placeholder="myapp://channel?code=QUEST_ROMA&role=receiver"
        ></textarea>
        @if (contentControl.invalid && contentControl.touched) {
          <mat-error>Il contenuto del QR e obbligatorio.</mat-error>
        }
      </mat-form-field>

      @if (errorMessage) {
        <p class="error">{{ errorMessage }}</p>
      }

      <div class="actions">
        <button mat-stroked-button type="button" (click)="fillSample('receiver')">
          Esempio receiver
        </button>
        <button mat-stroked-button type="button" (click)="fillSample('sender')">
          Esempio sender
        </button>
      </div>

      <button mat-flat-button color="primary" type="button" (click)="parseQr()">
        Conferma QR
      </button>
    </mat-card>
  `,
  styles: [
    `
      .scanner-card,
      .camera-mock {
        display: grid;
        gap: 12px;
      }

      .scanner-card {
        padding: 8px;
        border-radius: 24px;
      }

      .camera-mock {
        justify-items: center;
        text-align: center;
        padding: 24px 16px;
        border: 1px dashed #a3b3d9;
        border-radius: 20px;
        background: linear-gradient(135deg, #eff4ff, #fafcff);
      }

      .camera-mock p,
      .error {
        margin: 0;
      }

      .error {
        color: #b42318;
      }

      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
    `
  ]
})
export class QrScannerComponent {
  @Output() parsed = new EventEmitter<ParsedQrPayload>();

  readonly contentControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  errorMessage = '';

  constructor(private readonly qrService: QrService) {}

  fillSample(role: 'receiver' | 'sender'): void {
    this.contentControl.setValue(`myapp://channel?code=QUEST_ROMA&role=${role}`);
    this.errorMessage = '';
  }

  parseQr(): void {
    this.contentControl.markAsTouched();
    if (this.contentControl.invalid) {
      return;
    }

    try {
      const parsed = this.qrService.parse(this.contentControl.getRawValue());
      this.errorMessage = '';
      this.parsed.emit(parsed);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'QR non valido.';
    }
  }
}

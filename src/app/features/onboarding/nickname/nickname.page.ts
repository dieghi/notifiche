import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DeviceRegistrationService } from '../../../core/services/device-registration.service';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <header class="page-header">
          <h1>Scegli un nickname</h1>
          <p>Questo nome verra mostrato nelle notifiche inviate dai canali in cui sei sender.</p>
        </header>

        <mat-card class="surface-card form-card">
          <form [formGroup]="form" (ngSubmit)="continue()">
            <mat-form-field appearance="outline">
              <mat-label>Nickname</mat-label>
              <input matInput formControlName="nickname" maxlength="24" />
              @if (form.controls.nickname.invalid && form.controls.nickname.touched) {
                <mat-error>Inserisci un nickname valido.</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit">
              Continua
            </button>
          </form>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .form-card,
      form {
        display: grid;
        gap: 16px;
      }

      .form-card {
        padding: 20px;
      }
    `
  ]
})
export class NicknamePage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly registrationService = inject(DeviceRegistrationService);
  private readonly router = inject(Router);

  readonly form = this.formBuilder.nonNullable.group({
    nickname: ['', [Validators.required, Validators.maxLength(24)]]
  });

  continue(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const nickname = this.form.getRawValue().nickname.trim();
    this.registrationService.updateNickname(nickname);
    sessionStorage.setItem('notifyqr.pendingNickname', nickname);
    void this.router.navigate(['/onboarding/confirm']);
  }
}

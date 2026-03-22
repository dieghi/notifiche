import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SenderPayload } from '../../core/models/app.models';

@Component({
  selector: 'app-sender-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <mat-card class="sender-card">
      <h3>Invia una notifica</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Titolo</mat-label>
          <input matInput formControlName="title" maxlength="60" />
          @if (form.controls.title.invalid && form.controls.title.touched) {
            <mat-error>Inserisci un titolo.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Messaggio</mat-label>
          <textarea matInput rows="4" formControlName="body" maxlength="180"></textarea>
          @if (form.controls.body.invalid && form.controls.body.touched) {
            <mat-error>Inserisci un messaggio.</mat-error>
          }
        </mat-form-field>

        <button mat-flat-button color="primary" type="submit" [disabled]="sending">
          {{ sending ? 'Invio in corso...' : 'Invia notifica' }}
        </button>
      </form>
    </mat-card>
  `,
  styles: [
    `
      .sender-card,
      form {
        display: grid;
        gap: 14px;
      }

      .sender-card {
        border-radius: 24px;
      }

      h3 {
        margin: 0;
      }
    `
  ]
})
export class SenderFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) channelCode!: string;
  @Input() sending = false;
  @Output() sendPayload = new EventEmitter<SenderPayload>();

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(60)]],
    body: ['', [Validators.required, Validators.maxLength(180)]]
  });

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const { title, body } = this.form.getRawValue();
    this.sendPayload.emit({
      channelCode: this.channelCode,
      title,
      body
    });
  }

  reset(): void {
    this.form.reset({
      title: '',
      body: ''
    });
  }
}

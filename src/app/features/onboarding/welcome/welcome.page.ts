import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <section class="hero">
          <p class="eyebrow">NotifyQR</p>
          <h1>Unisciti ai tuoi canali in pochi secondi</h1>
          <p>
            Scansiona il QR del canale, scegli il tuo nickname e preparati a ricevere notifiche sul
            telefono.
          </p>
        </section>

        <mat-card class="surface-card intro-card">
          <div class="intro-grid">
            <div class="intro-item">
              <mat-icon>qr_code_2</mat-icon>
              <strong>Scansione rapida</strong>
              <span>Ogni QR porta subito al canale corretto.</span>
            </div>
            <div class="intro-item">
              <mat-icon>notifications</mat-icon>
              <strong>Notifiche push</strong>
              <span>Perfetto per giochi, gruppi e coordinamento leggero.</span>
            </div>
            <div class="intro-item">
              <mat-icon>send</mat-icon>
              <strong>Ruolo sender</strong>
              <span>Chi ha il ruolo sender puo anche inviare messaggi.</span>
            </div>
          </div>
        </mat-card>

        <button mat-flat-button color="primary" size="large" routerLink="/onboarding/scan">
          Inizia onboarding
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .hero,
      .intro-grid {
        display: grid;
        gap: 14px;
      }

      .hero {
        padding-top: 18px;
      }

      .eyebrow {
        margin: 0;
        color: #4465d8;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1,
      p,
      span {
        margin: 0;
      }

      .intro-card {
        padding: 20px;
      }

      .intro-item {
        display: grid;
        gap: 8px;
      }

      mat-icon {
        color: #4465d8;
      }
    `
  ]
})
export class WelcomePage {}

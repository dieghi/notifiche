import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParsedQrPayload } from '../../../core/models/app.models';
import { DeviceRegistrationService } from '../../../core/services/device-registration.service';
import { QrScannerComponent } from '../../../shared/components/qr-scanner.component';

@Component({
  standalone: true,
  imports: [QrScannerComponent],
  template: `
    <div class="page-shell">
      <div class="page-content stack">
        <header class="page-header">
          <h1>Scansiona il QR del canale</h1>
          <p>Puoi usare la fotocamera in una fase successiva. Per ora il flow e pronto in modalita mock.</p>
        </header>

        <app-qr-scanner (parsed)="saveAndContinue($event)" />
      </div>
    </div>
  `
})
export class QrScanPage {
  constructor(
    private readonly registrationService: DeviceRegistrationService,
    private readonly router: Router
  ) {}

  saveAndContinue(payload: ParsedQrPayload): void {
    this.registrationService.savePendingQr(payload);
    void this.router.navigate(['/onboarding/nickname']);
  }
}

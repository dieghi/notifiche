import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceRegistrationService } from '../../core/services/device-registration.service';

@Component({
  standalone: true,
  template: ''
})
export class RootRedirectPage {
  private readonly router = inject(Router);
  private readonly registrationService = inject(DeviceRegistrationService);

  constructor() {
    void this.router.navigateByUrl(
      this.registrationService.isOnboardingCompleted() ? '/home' : '/onboarding/welcome',
      { replaceUrl: true }
    );
  }
}

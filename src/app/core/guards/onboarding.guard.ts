import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DeviceRegistrationService } from '../services/device-registration.service';

export const completedOnboardingGuard: CanActivateFn = () => {
  const registrationService = inject(DeviceRegistrationService);
  const router = inject(Router);

  if (registrationService.isOnboardingCompleted()) {
    return true;
  }

  return router.createUrlTree(['/onboarding/welcome']);
};

export const onboardingEntryGuard: CanActivateFn = () => {
  const registrationService = inject(DeviceRegistrationService);
  const router = inject(Router);

  if (registrationService.isOnboardingCompleted()) {
    return router.createUrlTree(['/home']);
  }

  return true;
};

export const pendingQrGuard: CanActivateFn = () => {
  const registrationService = inject(DeviceRegistrationService);
  const router = inject(Router);

  if (registrationService.getPendingQr()) {
    return true;
  }

  return router.createUrlTree(['/onboarding/scan']);
};

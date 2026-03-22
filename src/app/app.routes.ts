import { Routes } from '@angular/router';
import {
  completedOnboardingGuard,
  onboardingEntryGuard,
  pendingQrGuard
} from './core/guards/onboarding.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/root/root-redirect.page').then((m) => m.RootRedirectPage)
  },
  {
    path: 'onboarding',
    canActivate: [onboardingEntryGuard],
    children: [
      {
        path: 'welcome',
        loadComponent: () =>
          import('./features/onboarding/welcome/welcome.page').then((m) => m.WelcomePage)
      },
      {
        path: 'scan',
        loadComponent: () =>
          import('./features/onboarding/qr-scan/qr-scan.page').then((m) => m.QrScanPage)
      },
      {
        path: 'nickname',
        canActivate: [pendingQrGuard],
        loadComponent: () =>
          import('./features/onboarding/nickname/nickname.page').then((m) => m.NicknamePage)
      },
      {
        path: 'confirm',
        canActivate: [pendingQrGuard],
        loadComponent: () =>
          import('./features/onboarding/confirm/confirm.page').then((m) => m.ConfirmPage)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'welcome'
      }
    ]
  },
  {
    path: 'home',
    canActivate: [completedOnboardingGuard],
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage)
  },
  {
    path: 'channels/add',
    canActivate: [completedOnboardingGuard],
    loadComponent: () =>
      import('./features/channels/add-channel/add-channel.page').then((m) => m.AddChannelPage)
  },
  {
    path: 'channels/:channelCode',
    canActivate: [completedOnboardingGuard],
    loadComponent: () =>
      import('./features/channels/channel-detail/channel-detail.page').then(
        (m) => m.ChannelDetailPage
      )
  },
  {
    path: 'settings',
    canActivate: [completedOnboardingGuard],
    loadComponent: () =>
      import('./features/settings/settings.page').then((m) => m.SettingsPage)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

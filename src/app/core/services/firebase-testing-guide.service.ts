import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FirebaseTestingGuideService {
  readonly steps = [
    'Apri Firebase Console e vai su Project settings > Cloud Messaging.',
    'Nella sezione Web Push certificates genera o copia la public VAPID key.',
    'Inserisci la chiave in src/environments/environment.ts e environment.prod.ts.',
    'Riavvia NotifyQR, attiva le notifiche e copia il token FCM dalla pagina Impostazioni.',
    'Vai in Messaging > Notifications > New campaign > Notifications.',
    'Usa "Send test message", incolla il token FCM e invia il test con l’app in background.'
  ];
}

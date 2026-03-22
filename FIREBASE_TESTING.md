# FIREBASE_TESTING.md

## Obiettivo

Portare NotifyQR al primo test reale con Firebase Cloud Messaging.

## Cosa serve davvero

Per ottenere un token FCM web reale serve la **public VAPID key** del progetto Firebase.

Percorso console:

`Project settings > Cloud Messaging > Web configuration > Web Push certificates`

## Dove inserirla

Aggiorna entrambi i file:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

Sostituisci:

```ts
vapidKey: 'REPLACE_WITH_PUBLIC_VAPID_KEY'
```

con la chiave pubblica reale.

## Test end-to-end piu veloce

1. Avvia l'app in locale.
2. Completa onboarding oppure vai in Impostazioni.
3. Premi `Attiva notifiche reali`.
4. Se il browser concede il permesso e la VAPID e corretta, l'app salva un token FCM.
5. Copia il token da Impostazioni.
6. Vai in Firebase Console > Messaging.
7. Crea una Notification campaign.
8. Usa `Send test message`.
9. Incolla il token FCM.
10. Lascia l'app in background e invia il test.

## Nota importante

Il frontend **non deve** inviare direttamente messaggi via Admin SDK o HTTP v1 con credenziali sensibili.

Per il send flow reale dell'app servirà uno di questi approcci:

- Cloud Functions
- backend dedicato

## Riferimenti ufficiali verificati

- Firebase FCM Web setup: https://firebase.google.com/docs/cloud-messaging/js/first-message
- Firebase receive messages: https://firebase.google.com/docs/cloud-messaging/js/receive
- Firebase message types / send test with console: https://firebase.google.com/docs/cloud-messaging/customize-messages/set-message-type

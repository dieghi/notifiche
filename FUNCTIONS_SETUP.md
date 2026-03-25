# FUNCTIONS_SETUP.md

## Obiettivo

Abilitare l'invio reale delle notifiche dall'app NotifyQR tramite Firebase Cloud Functions.

## Architettura minima

- il client salva in Firestore:
  - `deviceRegistrations`
  - `channelSubscriptions`
- il sender chiama la callable function `sendChannelNotification`
- la Function legge i `receiver` del canale
- la Function invia il push FCM ai token trovati

## File aggiunti

- `functions/index.js`
- `functions/package.json`
- `firebase.json`
- `.firebaserc`
- `firestore.rules`
- `firestore.indexes.json`

## Deploy

Dalla root del progetto:

```bash
cd /Users/diegosorrentino/Progetti/diego/notifiche/functions
npm install
cd ..
firebase deploy --only functions,firestore
```

## Nota importante

Il deploy delle Functions richiede login Firebase CLI sulla tua macchina.

## Test reale

1. Apri l'app
2. Ogni device fa `Attiva notifiche reali`
3. Ogni device fa `Sincronizza cloud`
4. Un device `receiver` deve avere token valido
5. Un device `sender` entra nel dettaglio canale e invia la notifica

## Limiti attuali volontari

- regole Firestore molto aperte per partire rapidamente
- nessuna autenticazione forte
- nessuna pulizia automatica token invalidi

Questa e una prima fase pragmatica, non la versione hardened.

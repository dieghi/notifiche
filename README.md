# NotifyQR

NotifyQR e una Angular PWA mobile-first per iscriversi a canali tramite QR code, ricevere notifiche push Firebase e, per i canali con ruolo `sender`, inviare notifiche.

## Sviluppo locale

```bash
npm install
npm start
```

App locale: `http://127.0.0.1:4200/`

## Build GitHub Pages

```bash
npm run build:github
```

L'app viene pubblicata automaticamente su GitHub Pages tramite workflow GitHub Actions quando fai push su `main`.

URL atteso:

`https://dieghi.github.io/notifiche/`

## Firebase

La configurazione Firebase client e la VAPID pubblica sono negli environment Angular.

Per testare FCM:

1. apri l'app
2. vai in `Impostazioni`
3. attiva le notifiche reali
4. copia il token FCM
5. invia un test da Firebase Console

Guida rapida: [FIREBASE_TESTING.md](./FIREBASE_TESTING.md)

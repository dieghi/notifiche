import { Injectable } from '@angular/core';
import { ParsedQrPayload } from '../models/app.models';

@Injectable({ providedIn: 'root' })
export class QrService {
  parse(content: string): ParsedQrPayload {
    const trimmed = content.trim();

    if (!trimmed) {
      throw new Error('Inserisci o scansiona un QR valido.');
    }

    let url: URL;

    try {
      url = new URL(trimmed);
    } catch {
      throw new Error('Formato QR non riconosciuto.');
    }

    if (url.protocol !== 'myapp:' || url.hostname !== 'channel') {
      throw new Error('Il QR non appartiene a un canale NotifyQR.');
    }

    const channelCode = url.searchParams.get('code')?.trim().toUpperCase();
    const role = url.searchParams.get('role')?.trim();

    if (!channelCode) {
      throw new Error('Nel QR manca il codice canale.');
    }

    if (role !== 'receiver' && role !== 'sender') {
      throw new Error('Il ruolo del QR non e valido.');
    }

    return {
      channelCode,
      role
    };
  }
}

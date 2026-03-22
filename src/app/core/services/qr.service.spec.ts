import { describe, expect, it } from 'vitest';
import { QrService } from './qr.service';

describe('QrService', () => {
  const service = new QrService();

  it('parses a valid receiver qr', () => {
    expect(service.parse('myapp://channel?code=quest_roma&role=receiver')).toEqual({
      channelCode: 'QUEST_ROMA',
      role: 'receiver'
    });
  });

  it('throws on invalid role', () => {
    expect(() => service.parse('myapp://channel?code=quest_roma&role=admin')).toThrowError(
      'Il ruolo del QR non e valido.'
    );
  });
});

import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('stores and reads registration', () => {
    service.setRegistration({
      deviceId: 'device-1',
      nickname: 'Luca',
      platform: 'web',
      notificationPermission: 'default',
      isPwaInstalled: false,
      onboardingCompleted: true,
      createdAt: '2026-03-22T09:00:00.000Z',
      updatedAt: '2026-03-22T09:00:00.000Z'
    });

    expect(service.getRegistration()?.nickname).toBe('Luca');
  });
});

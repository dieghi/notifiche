import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

@Injectable({ providedIn: 'root' })
export class PwaService {
  private readonly platformId = inject(PLATFORM_ID);
  private deferredPrompt = signal<BeforeInstallPromptEvent | null>(null);
  private readonly installed = signal(false);
  private readonly ios = signal(false);
  private readonly safari = signal(false);

  readonly canInstall = computed(() => !!this.deferredPrompt());
  readonly isInstalled = this.installed.asReadonly();
  readonly isIos = this.ios.asReadonly();
  readonly isSafari = this.safari.asReadonly();
  readonly showIosInstructions = computed(
    () => this.isIos() && this.isSafari() && !this.isInstalled()
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.syncInstallState();
    this.detectPlatform();

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferredPrompt.set(event as BeforeInstallPromptEvent);
    });

    window.addEventListener('appinstalled', () => {
      this.installed.set(true);
      this.deferredPrompt.set(null);
    });
  }

  async triggerInstall(): Promise<boolean> {
    const prompt = this.deferredPrompt();
    if (!prompt) {
      return false;
    }

    await prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      this.installed.set(true);
      this.deferredPrompt.set(null);
    }

    return result.outcome === 'accepted';
  }

  private syncInstallState(): void {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = 'standalone' in window.navigator
      ? Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)
      : false;

    this.installed.set(isStandalone || isNavigatorStandalone);
  }

  private detectPlatform(): void {
    const userAgent = window.navigator.userAgent.toLowerCase();
    this.ios.set(/iphone|ipad|ipod/.test(userAgent));
    this.safari.set(/safari/.test(userAgent) && !/crios|fxios|edgios|chrome/.test(userAgent));
  }
}

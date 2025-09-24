'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Download, Monitor, Smartphone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      const isFullscreen = window.matchMedia(
        '(display-mode: fullscreen)',
      ).matches;
      const isMinimalUI = window.matchMedia(
        '(display-mode: minimal-ui)',
      ).matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;

      return isStandalone || isFullscreen || isMinimalUI || isInWebAppiOS;
    };

    if (checkIfInstalled()) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log(
        'Chrome beforeinstallprompt event fired - PWA can be installed',
      );
      // Don't prevent default - let Chrome show its native install prompt
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show custom install prompt as a backup after Chrome's prompt
      setTimeout(() => {
        // Only show custom prompt if Chrome hasn't shown the native one yet
        if (!isInstalled && deferredPrompt) {
          setShowInstallPrompt(true);
        }
      }, 5000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);

      toast.success('App installiert!', {
        description:
          'Q.V Sports wurde erfolgreich auf deinem Gerät installiert.',
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during app installation:', error);
      toast.error('Installation fehlgeschlagen', {
        description:
          'Die App konnte nicht installiert werden. Bitte versuche es später erneut.',
      });
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);

    // Don't show again for this session (only in browser)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-install-dismissed', 'true');
    }
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled) {
    return null;
  }

  // Check session storage only on client side
  if (
    typeof window !== 'undefined' &&
    sessionStorage.getItem('pwa-install-dismissed')
  ) {
    return null;
  }

  if (!showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:max-w-sm">
      <Card className="bg-card/95 backdrop-blur-sm border-border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  App installieren
                </CardTitle>
                <CardDescription className="text-xs">
                  Q.V Sports auf deinem Gerät
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Monitor className="h-3 w-3" />
              <span>Offline-Zugriff auf Trainingsmaterialien</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Download className="h-3 w-3" />
              <span>Schneller Zugriff vom Homescreen</span>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                <Download className="mr-1 h-3 w-3" />
                Installieren
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
                className="h-8 text-xs"
              >
                Später
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PWAInstallPrompt;

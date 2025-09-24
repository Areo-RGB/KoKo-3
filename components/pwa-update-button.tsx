'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Download, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function PWAUpdateButton() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const checkIfPWA = () => {
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

    setIsInstalled(checkIfPWA());

    if (!checkIfPWA()) return;

    // Listen for service worker updates
    const handleServiceWorkerUpdate = () => {
      setHasUpdate(true);
    };

    // Check for waiting service worker on load
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setHasUpdate(true);
        }

        // Listen for new service worker installing
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setHasUpdate(true);
              }
            });
          }
        });
      });

      // Listen for controller changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setHasUpdate(false);
        window.location.reload();
      });
    }
  }, []);

  const checkForUpdates = async () => {
    if (!('serviceWorker' in navigator)) {
      toast.error('Service Worker nicht unterstützt');
      return;
    }

    setIsChecking(true);

    try {
      const registration = await navigator.serviceWorker.ready;

      // Force check for updates
      await registration.update();

      // Check if there's a waiting service worker
      if (registration.waiting) {
        setHasUpdate(true);
        toast.info('Update verfügbar!', {
          description: 'Eine neue Version der App ist bereit.',
        });
      } else {
        toast.success('App ist aktuell', {
          description: 'Du hast bereits die neueste Version.',
        });
      }
    } catch (error) {
      console.error('Update check failed:', error);
      toast.error('Update-Prüfung fehlgeschlagen', {
        description: 'Bitte versuche es später erneut.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const applyUpdate = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;

      if (registration.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

        toast.success('Update wird angewendet...', {
          description: 'Die App wird in Kürze neu geladen.',
        });
      }
    } catch (error) {
      console.error('Failed to apply update:', error);
      toast.error('Update fehlgeschlagen', {
        description: 'Bitte lade die Seite manuell neu.',
      });
    }
  };

  // Don't show if not installed as PWA
  if (!isInstalled) {
    return null;
  }

  if (hasUpdate) {
    return (
      <Button
        onClick={applyUpdate}
        size="sm"
        variant="default"
        className="h-7 px-2 text-xs"
      >
        <Download className="h-3 w-3 mr-1" />
        Update
      </Button>
    );
  }

  return (
    <Button
      onClick={checkForUpdates}
      size="sm"
      variant="ghost"
      disabled={isChecking}
      className="h-7 px-2 text-xs hover:bg-sidebar-accent"
    >
      {isChecking ? (
        <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
      ) : (
        <CheckCircle className="h-3 w-3 mr-1" />
      )}
      {isChecking ? 'Prüfe...' : 'Updates'}
    </Button>
  );
}

export default PWAUpdateButton;

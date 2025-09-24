'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        const showUpdateToast = (worker: ServiceWorker) => {
          toast.success('Eine neue Version ist verfügbar!', {
            description:
              'Laden Sie die Seite neu, um die App zu aktualisieren.',
            duration: Infinity,
            action: {
              label: 'Neu laden',
              onClick: () => {
                worker.postMessage({ type: 'SKIP_WAITING' });
              },
            },
            cancel: { label: 'Später', onClick: () => {} },
          });
        };

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                showUpdateToast(newWorker);
              }
            });
          }
        });

        if (registration.waiting) {
          showUpdateToast(registration.waiting);
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        if (process.env.NODE_ENV === 'development') {
          toast.error('Service Worker Fehler', {
            description:
              'Die Registrierung ist fehlgeschlagen. Offline-Funktionen sind möglicherweise nicht verfügbar.',
          });
        }
      }
    };

    const onControllerChange = () => {
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      onControllerChange,
    );
    window.addEventListener('load', registerServiceWorker);

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      );
    };
  }, []);

  return null;
}

export default ServiceWorkerRegistration;

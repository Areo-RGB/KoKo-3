'use client';

import { useEffect } from 'react';

const SERVICE_WORKER_PATH = '/sw.js';

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!('serviceWorker' in navigator)) {
      return;
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          SERVICE_WORKER_PATH,
          {
            scope: '/',
          },
        );

        if (process.env.NODE_ENV !== 'production') {
          console.info('Service worker registered:', registration.scope);
        }
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    registerServiceWorker();
  }, []);

  return null;
}

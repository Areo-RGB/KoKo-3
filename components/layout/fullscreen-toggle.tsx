'use client';

import { Maximize } from 'lucide-react';
import * as React from 'react';

export function FullscreenToggle(): React.ReactElement {
  const handleClick = (_: React.MouseEvent<HTMLButtonElement>): void => {
    if (document.fullscreenElement == null) {
      void document.documentElement.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  };

  return (
    <button
      type="button"
      aria-label="Vollbild umschalten"
      onClick={handleClick}
      className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
    >
      <Maximize className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      <span className="sr-only">Vollbild umschalten</span>
    </button>
  );
}

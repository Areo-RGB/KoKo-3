'use client';

import { cn } from '@/lib/utils';
import { Maximize, Minimize } from 'lucide-react';
import * as React from 'react';

/**
 * A hook to manage browser fullscreen state and provide a toggle function.
 */
function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement != null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Set initial state in case the page loads in fullscreen mode
    handleFullscreenChange();

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = React.useCallback(async () => {
    try {
      if (document.fullscreenElement == null) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  }, []);

  return { isFullscreen, toggleFullscreen };
}

interface FullscreenToggleProps
  extends React.ComponentPropsWithoutRef<'button'> {
  iconClassName?: string;
}

export function FullscreenToggle({
  className,
  iconClassName,
  ...props
}: FullscreenToggleProps): React.ReactElement {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const label = isFullscreen ? 'Vollbild beenden' : 'Vollbild aktivieren';
  const Icon = isFullscreen ? Minimize : Maximize;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={toggleFullscreen}
      className={cn(
        'hover:bg-muted rounded-full p-2 transition-colors',
        className,
      )}
      {...props}
    >
      <Icon className={cn('text-muted-foreground h-5 w-5', iconClassName)} />
      <span className="sr-only">{label}</span>
    </button>
  );
}

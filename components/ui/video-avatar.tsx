'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface VideoAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt?: string;
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
}

const VideoAvatar = React.forwardRef<HTMLDivElement, VideoAvatarProps>(
  (
    {
      src,
      alt,
      loop = true,
      muted = true,
      autoPlay = true,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
          className,
        )}
        {...props}
      >
        <video
          src={src}
          loop={loop}
          muted={muted}
          autoPlay={autoPlay}
          playsInline
          className="aspect-square h-full w-full object-cover"
          aria-label={alt}
        />
      </div>
    );
  },
);
VideoAvatar.displayName = 'VideoAvatar';

export { VideoAvatar };

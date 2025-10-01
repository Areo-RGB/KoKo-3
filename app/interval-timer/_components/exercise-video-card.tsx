import { Card } from '@/components/ui/card';
import { EXERCISE_MEDIA_MAP } from '../_lib/exercise-media';
import type { TimerPhase } from '../_lib/types';
import { Film } from 'lucide-react';
import { useCallback, useRef } from 'react';

interface ExerciseVideoCardProps {
  phase: TimerPhase | null;
}

export default function ExerciseVideoCard({ phase }: ExerciseVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // This function will be called when the card is tapped.
  const handleTogglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Toggle play/pause state
    if (video.paused || video.ended) {
      video.play().catch(error => {
        // Autoplay policies can prevent play, so we catch errors.
        console.error("Error attempting to play video:", error);
      });
    } else {
      video.pause();
    }
  }, []);

  if (!phase) {
    return null;
  }

  const media = EXERCISE_MEDIA_MAP[phase.name];
  const videoSrc = media?.videoSrc;
  const posterSrc = media?.posterSrc ?? media?.imageSrc;
  const hasVideo = !!videoSrc;

  // When the user taps anywhere on the card, including the video and its controls,
  // the handleTogglePlay function will fire.
  return (
    <Card
      className="overflow-hidden p-0"
      onClick={hasVideo ? handleTogglePlay : undefined}
      style={{ cursor: hasVideo ? 'pointer' : 'default' }}
      role={hasVideo ? 'button' : undefined}
      aria-label={hasVideo ? 'Toggle video play/pause' : undefined}
      tabIndex={hasVideo ? 0 : -1}
      onKeyDown={(e) => {
        if (hasVideo && (e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          handleTogglePlay();
        }
      }}
    >
      {hasVideo ? (
        <div className="aspect-video w-full bg-muted">
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            poster={posterSrc}
            controls
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full flex flex-col items-center justify-center bg-muted text-muted-foreground p-6">
          {phase.instructions ? (
            <p className="text-center">{phase.instructions}</p>
          ) : (
            <>
              <Film className="h-10 w-10 mb-2" />
              <p>No video for this step.</p>
            </>
          )}
        </div>
      )}
    </Card>
  );
}

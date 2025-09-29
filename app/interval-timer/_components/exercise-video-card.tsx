import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EXERCISE_MEDIA_MAP } from '../_lib/exercise-media';
import type { TimerPhase } from '../_lib/types';
import { Film } from 'lucide-react';

interface ExerciseVideoCardProps {
  phase: TimerPhase | null;
}

export default function ExerciseVideoCard({ phase }: ExerciseVideoCardProps) {
  if (!phase) {
    return null;
  }

  const media = EXERCISE_MEDIA_MAP[phase.name];
  const videoSrc = media?.videoSrc;
  const posterSrc = media?.posterSrc ?? media?.imageSrc;
  const hasVideo = !!videoSrc;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        {hasVideo ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
            <video
              key={videoSrc} // Add key to force re-render when src changes
              src={videoSrc}
              poster={posterSrc}
              controls
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video w-full flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted text-muted-foreground">
            {phase.instructions ? (
              <p className="p-4 text-center">{phase.instructions}</p>
            ) : (
              <>
                <Film className="h-10 w-10 mb-2" />
                <p>No video for this step.</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
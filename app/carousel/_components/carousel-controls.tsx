interface CarouselControlsProps {
  isPlaying: boolean;
  current: number;
  count: number;
  onToggleAutoplay: () => void;
}

export function CarouselControls({
  isPlaying,
  current,
  count,
  onToggleAutoplay,
}: CarouselControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onClick={onToggleAutoplay}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
      >
        {isPlaying ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <rect x="6" y="4" width="3" height="12" />
              <rect x="11" y="4" width="3" height="12" />
            </svg>
            <span className="text-sm">Pause</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
            <span className="text-sm">Play</span>
          </>
        )}
      </button>

      <div className="text-gray-400">
        <span className="text-sm">
          {current} / {count}
        </span>
      </div>
    </div>
  );
}

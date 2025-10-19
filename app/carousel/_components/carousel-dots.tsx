interface CarouselDotsProps {
  count: number;
  current: number;
  onDotClick: (index: number) => void;
}

export function CarouselDots({ count, current, onDotClick }: CarouselDotsProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current - 1
              ? 'bg-white w-8'
              : 'bg-gray-500 hover:bg-gray-400 w-2'
          }`}
          onClick={() => onDotClick(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}

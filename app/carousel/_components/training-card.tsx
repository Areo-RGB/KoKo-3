import { CarouselImage } from './carousel-data';

interface TrainingCardProps {
  image: CarouselImage;
}

export function TrainingCard({ image }: TrainingCardProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="relative w-full max-w-4xl aspect-[4/5] overflow-hidden rounded-lg bg-gray-900">
        <img
          src={image.src}
          alt={image.alt}
          className="h-full w-full object-contain transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <p className="text-white text-sm font-medium">{image.alt}</p>
        </div>
      </div>
    </div>
  );
}

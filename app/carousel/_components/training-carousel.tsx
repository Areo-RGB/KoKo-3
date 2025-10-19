'use client';

import { useCallback, useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import AutoHeight from 'embla-carousel-auto-height';
import Fade from 'embla-carousel-fade';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { carouselImages } from './carousel-data';
import { CarouselControls } from './carousel-controls';
import { CarouselDots } from './carousel-dots';
import { TrainingCard } from './training-card';

export function TrainingCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    setCount(api.scrollSnapList().length);
  }, []);

  const toggleAutoplay = useCallback(() => {
    if (!api) return;
    if (isPlaying) {
      api.plugins()?.autoplay?.stop();
    } else {
      api.plugins()?.autoplay?.play();
    }
    setIsPlaying(!isPlaying);
  }, [api, isPlaying]);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on('select', onSelect);
    api.on('reInit', onSelect);

    return () => {
      api?.off('select', onSelect);
      api?.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-black pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="flex flex-1 items-center justify-center px-4 py-6 sm:py-12">
        <Carousel
          setApi={setApi}
          className="w-full max-w-5xl"
          opts={{
            align: 'center',
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
            }),
            AutoHeight(),
            Fade(),
          ]}
        >
          <CarouselContent className="ml-0 items-center justify-center transition-height">
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="flex items-center justify-center pl-0">
                <TrainingCard image={image} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>

      <div className="flex flex-col items-center gap-4 px-4 pb-8">
        <CarouselDots
          count={count}
          current={current}
          onDotClick={(index) => api?.scrollTo(index)}
        />

        <CarouselControls
          isPlaying={isPlaying}
          current={current}
          count={count}
          onToggleAutoplay={toggleAutoplay}
        />
      </div>
    </div>
  );
}

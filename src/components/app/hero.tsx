
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Great Experience',
    subtitle: 'We Believe In Quality Not Quantity',
    buttonText: 'Apply',
    buttonLink: '#apply',
    imageId: 'hero-truck',
  },
  {
    id: 'hero-2',
    title: 'Our Mission',
    subtitle: 'Delivering excellence in logistics and teamwork.',
    buttonText: 'Learn More',
    buttonLink: '#',
    imageId: 'hero-truck-2',
  },
  {
    id: 'hero-3',
    title: 'Join Us',
    subtitle: 'Be part of something bigger.',
    buttonText: 'Get Started',
    buttonLink: '#apply',
    imageId: 'hero-truck-3',
  }
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      className="w-full"
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {heroSlides.map((slide) => {
          const image = PlaceHolderImages.find((img) => img.id === slide.imageId);
          return (
            <CarouselItem key={slide.id}>
              <section className="relative h-[80vh] w-full flex items-center justify-center text-white">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    priority={heroSlides.indexOf(slide) === 0}
                  />
                )}
                <div className="absolute inset-0 bg-black/60" />
                <div className="relative z-10 text-center p-4">
                  <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg">
                    {slide.title}
                  </h1>
                  <p className="mt-4 text-lg md:text-xl text-muted-foreground drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  <Button asChild size="lg" className="mt-8 rounded-full">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </section>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

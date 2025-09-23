"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Tamil Pasanga',
    subtitle: 'Your gateway to new horizons. We believe in quality, not quantity.',
    buttonText: 'Apply',
    buttonLink: '#apply',
    imageId: 'hero-truck'
  },
  {
    id: 'hero-2',
    title: 'Our Mission',
    subtitle: 'Delivering excellence in logistics and teamwork.',
    buttonText: 'Learn More',
    buttonLink: '#features',
    imageId: 'hero-truck-2'
  },
  {
    id: 'hero-3',
    title: 'Join Us',
    subtitle: 'Be part of something bigger.',
    buttonText: 'Get Started',
    buttonLink: '#process',
    imageId: 'hero-truck-3'
  }
]

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full pt-20 overflow-hidden">
      <Carousel
        className="w-full h-full"
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {heroSlides.map((slide) => {
            const image = PlaceHolderImages.find(img => img.id === slide.imageId);
            return (
              <CarouselItem key={slide.id}>
                <div className="relative w-full h-full flex items-center justify-center text-center text-white">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      priority={slide.id === 'hero-1'}
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  <div className="relative z-10 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline">
                      {slide.id === 'hero-1' ? (
                         <span className="animate-rgb-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent [background-size:200%_auto]">
                           {slide.title}
                         </span>
                      ) : (
                        slide.title
                      )}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300">
                      {slide.subtitle}
                    </p>
                    <Button size="lg" className="mt-8 rounded-full text-lg px-8 py-6 font-semibold" asChild>
                      <a href={slide.buttonLink}>{slide.buttonText}</a>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}


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

const DiscordIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.36981C18.7915 3.72551 17.1857 3.28682 15.5292 3.09602C15.4239 3.36442 15.2891 3.72551 15.1838 3.99391C13.2435 3.63282 11.3159 3.63282 9.3883 3.99391C9.2702 3.72551 9.1355 3.36442 9.0302 3.09602C7.37371 3.28682 5.76792 3.72551 4.24243 4.36981C1.6917 8.16112 1.03961 11.898 1.9427 15.5422C3.73711 16.9832 5.56092 17.9351 7.42433 18.5794C7.79523 18.2183 8.13672 17.8315 8.44882 17.4191C8.01422 17.1801 7.59242 16.9283 7.18342 16.66C7.03851 16.5413 6.89361 16.4226 6.74871 16.2911C6.71931 16.2655 6.67711 16.2399 6.64771 16.2142C6.64771 16.2142 6.63501 16.2014 6.62221 16.1887C8.42931 17.3015 10.3862 17.9057 12.4173 17.9057C14.4483 17.9057 16.4052 17.3015 18.2124 16.1887C18.2007 16.2004 18.188 16.2142 18.188 16.2142C18.1586 16.2399 18.1164 16.2655 18.087 16.2911C17.9421 16.4226 17.7972 16.5413 17.6523 16.66C17.2433 16.9283 16.8215 17.1801 16.3869 17.4191C16.7118 17.8315 17.0405 18.2183 17.4114 18.5794C19.2748 17.9351 21.0986 16.9832 22.893 15.5422C23.8357 11.4593 23.0118 7.74971 20.317 4.36981ZM9.68069 13.848C8.68989 13.848 7.88939 12.9158 7.88939 11.783C7.88939 10.6502 8.67709 9.718 9.68069 9.718C10.6843 9.718 11.4848 10.6502 11.472 11.783C11.472 12.9158 10.6843 13.848 9.68069 13.848ZM14.8517 13.848C13.8609 13.848 13.0604 12.9158 13.0604 11.783C13.0604 10.6502 13.8481 9.718 14.8517 9.718C15.8553 9.718 16.6558 10.6502 16.643 11.783C16.643 12.9158 15.8553 13.848 14.8517 13.848Z"/>
  </svg>
);

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Great Experience',
    subtitle: 'We Believe In Quality Not Quantity',
    buttonText: 'Apply',
    buttonLink: '#',
    imageId: 'hero-truck',
    'data-apply-btn': true,
  },
  {
    id: 'hero-2',
    title: 'Our Mission',
    subtitle: 'Delivering excellence in logistics and teamwork.',
    imageId: 'hero-truck-2',
  },
  {
    id: 'hero-3',
    title: 'Join Us',
    subtitle: 'Be part of something bigger.',
    buttonText: 'Discord',
    buttonLink: 'https://discord.com/invite/paRCYhJphH',
    imageId: 'hero-truck-3',
    icon: <DiscordIcon />,
  }
];

export function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
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
          const buttonProps = { ...(slide['data-apply-btn'] ? { 'data-apply-btn': true } : {})};
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
                  <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg animate-rgb-text bg-gradient-to-r from-primary via-blue-500 to-red-500 bg-clip-text text-transparent [background-size:200%_auto]">
                    TAMIL PASANGA
                  </h1>
                  <p className="mt-4 text-2xl md:text-4xl font-semibold drop-shadow-md">
                    {slide.title}
                  </p>
                  <p className="mt-2 text-lg md:text-xl text-muted-foreground drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  {slide.buttonText && slide.buttonLink && (
                    <Button asChild size="lg" className="mt-8 rounded-full" {...buttonProps}>
                        <Link href={slide.buttonLink} target={slide.buttonLink.startsWith('http') ? '_blank' : '_self'}>
                        {slide.icon}
                        {slide.buttonText}
                        </Link>
                    </Button>
                  )}
                </div>
              </section>
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const heroImages = PlaceHolderImages.filter(img => img.id.startsWith('hero-'));

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-center text-white pt-20 overflow-hidden">
       <Carousel 
        className="w-full h-full"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {heroImages.map((image) => (
            <CarouselItem key={image.id}>
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                priority={image.id === 'hero-truck'}
                data-ai-hint={image.imageHint}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline">
          <span className="animate-rgb-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500 bg-clip-text text-transparent [background-size:200%_auto]">Tamil Pasanga</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300">
          Your gateway to new horizons. We believe in quality, not quantity.
        </p>
        <Button size="lg" className="mt-8 rounded-full text-lg px-8 py-6 font-semibold" asChild>
          <a href="#apply">Apply</a>
        </Button>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-truck');

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-center text-white pt-20 overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover animate-pan-bg"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
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

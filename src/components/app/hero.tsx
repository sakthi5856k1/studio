import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-truck');

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center text-center text-white pt-20">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline">
          <span className="text-primary animate-neon-glow">Tamil Pasanga</span>
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
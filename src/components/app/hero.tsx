import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';

export function Hero() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-truck');

  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center p-4">
        <h1 className="text-5xl md:text-7xl font-headline font-bold drop-shadow-lg">
          Great Experience
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground drop-shadow-md">
          We Believe In Quality Not Quantity
        </p>
        <Button asChild size="lg" className="mt-8 rounded-full">
          <Link href="#apply">Apply</Link>
        </Button>
      </div>
    </section>
  );
}

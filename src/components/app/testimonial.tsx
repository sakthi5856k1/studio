import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonialImage = PlaceHolderImages.find(img => img.id === 'testimonial-avatar');

export function Testimonial() {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        {testimonialImage && (
          <Image
            src={testimonialImage.imageUrl}
            alt={testimonialImage.description}
            width={100}
            height={100}
            className="rounded-full mx-auto mb-6 border-4 border-primary shadow-lg"
            data-ai-hint={testimonialImage.imageHint}
          />
        )}
        <Card className="bg-transparent border-0 shadow-none">
          <CardContent className="p-0">
            <blockquote className="text-xl md:text-2xl italic">
              “Tamil Pasanga has been a game-changer. The community is fantastic, and the management truly cares about its drivers. It’s more than just a VTC; it’s a family.”
            </blockquote>
            <p className="mt-6 font-semibold text-lg">powerful gaming</p>
            <p className="text-sm text-primary">managing Director</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { Header } from '@/components/app/header';
import { Hero } from '@/components/app/hero';
import { ApplicationSteps } from '@/components/app/application-steps';
import { Testimonial } from '@/components/app/testimonial';
import { Newsletter } from '@/components/app/newsletter';
import { Footer } from '@/components/app/footer';
import { CoreValues } from '@/components/app/core-values';
import newsData from '@/lib/news-articles.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const newslettersWithImages = newsData.newsletters.slice(0, 3).map(item => {
    const image = PlaceHolderImages.find(img => img.id === item.imageId);
    return { ...item, imageUrl: image?.imageUrl, imageDescription: image?.description, imageHint: image?.imageHint };
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <CoreValues />
        <ApplicationSteps />
        <Testimonial />
        <Newsletter articles={newslettersWithImages} />
      </main>
      <Footer />
    </div>
  );
}

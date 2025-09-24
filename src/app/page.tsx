import { Header } from '@/components/app/header';
import { Hero } from '@/components/app/hero';
import { About } from '@/components/app/about';
import { ApplicationSteps } from '@/components/app/application-steps';
import { Achievements } from '@/components/app/achievements';
import { Testimonial } from '@/components/app/testimonial';
import { Newsletter } from '@/components/app/newsletter';
import { Footer } from '@/components/app/footer';
import { CoreValues } from '@/components/app/core-values';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <CoreValues />
        <ApplicationSteps />
        <Achievements />
        <Testimonial />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

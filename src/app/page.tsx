import { Header } from '@/components/app/header';
import { Features } from '@/components/app/features';
import { ApplicationSteps } from '@/components/app/application-steps';
import { Achievements } from '@/components/app/achievements';
import { Testimonial } from '@/components/app/testimonial';
import { Newsletter } from '@/components/app/newsletter';
import { Footer } from '@/components/app/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-20">
        <Features />
        <ApplicationSteps />
        <Achievements />
        <Testimonial />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

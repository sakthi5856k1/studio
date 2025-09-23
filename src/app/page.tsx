import { Header } from '@/components/app/header';
import { Hero } from '@/components/app/hero';
import { About } from '@/components/app/about';
import { ApplicationSteps } from '@/components/app/application-steps';
import { Achievements } from '@/components/app/achievements';
import { Testimonial } from '@/components/app/testimonial';
import { Newsletter } from '@/components/app/newsletter';
import { Footer } from '@/components/app/footer';
import { ApplicationForm } from '@/components/app/application-form';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <ApplicationSteps />
        <ApplicationForm />
        <Achievements />
        <Testimonial />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

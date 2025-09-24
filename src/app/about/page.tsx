import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { About } from '@/components/app/about';
import { Achievements } from '@/components/app/achievements';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="pt-24">
          <About />
        </div>
        <Achievements />
      </main>
      <Footer />
    </div>
  );
}

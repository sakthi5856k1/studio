import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { About } from '@/components/app/about';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24">
        <About />
      </main>
      <Footer />
    </div>
  );
}

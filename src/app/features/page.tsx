import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { Features } from '@/components/app/features';

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24">
        <Features />
      </main>
      <Footer />
    </div>
  );
}

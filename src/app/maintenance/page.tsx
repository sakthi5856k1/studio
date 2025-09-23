import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { Construction } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center text-center">
        <div className="space-y-4">
          <Construction className="mx-auto h-16 w-16 text-primary" />
          <h1 className="text-4xl font-headline">Under Maintenance</h1>
          <p className="text-muted-foreground">
            This page is currently being updated. Please check back later.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

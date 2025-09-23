import { Footer } from '@/components/app/footer';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center text-center">
        <div className="space-y-4">
          <Shield className="mx-auto h-16 w-16 text-primary" />
          <h1 className="text-4xl font-headline">Admin Panel</h1>
          <p className="text-muted-foreground">
            Welcome to the admin area.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

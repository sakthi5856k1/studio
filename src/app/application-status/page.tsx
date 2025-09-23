import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { ApplicationStatus } from '@/components/app/application-status';

export default function ApplicationStatusPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-32 md:pt-40">
        <ApplicationStatus />
      </main>
      <Footer />
    </div>
  );
}

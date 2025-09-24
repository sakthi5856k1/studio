import { Footer } from '@/components/app/footer';
import { Button } from '@/components/ui/button';
import { Construction, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminGalleryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center text-center p-4">
        <div className="space-y-8 max-w-4xl w-full">
            <div className="space-y-4">
                <div className="flex justify-center items-center gap-4">
                    <ImageIcon className="mx-auto h-16 w-16 text-primary" />
                    <Construction className="mx-auto h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-headline">Manage Gallery</h1>
                <p className="text-muted-foreground">
                    This feature is currently under construction. Check back later!
                </p>
            </div>
            <Button variant="outline" asChild>
                <Link href="/admin">Back to Admin</Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

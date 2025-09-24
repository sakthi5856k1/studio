import { Footer } from '@/components/app/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Shield, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center text-center p-4">
        <div className="space-y-8 max-w-4xl w-full">
          <div className="space-y-2">
            <Shield className="mx-auto h-16 w-16 text-primary" />
            <h1 className="text-4xl font-headline">Admin Panel</h1>
            <p className="text-muted-foreground">
              Welcome to the admin area. Manage your site content here.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <Card className="bg-card hover:shadow-primary/20 transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper size={20} />
                  <span>Manage News</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Create, edit, and delete news articles for the homepage.</p>
                <Button asChild>
                  <Link href="/admin/news">Go to News</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="bg-card hover:shadow-primary/20 transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon size={20} />
                  <span>Manage Gallery</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Add, edit, and delete images in the website gallery.</p>
                <Button asChild>
                  <Link href="/admin/gallery">Go to Gallery</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

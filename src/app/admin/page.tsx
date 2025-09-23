import { Footer } from '@/components/app/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Shield } from 'lucide-react';
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
              Welcome to the admin area. Select a section to manage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-left hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Manage News
                </CardTitle>
                <Newspaper className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-4">
                  Create, edit, and delete news articles.
                </p>
                <Button asChild size="sm">
                  <Link href="/admin/news">Go to News</Link>
                </Button>
              </CardContent>
            </Card>
            {/* Add other management cards here in the future */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

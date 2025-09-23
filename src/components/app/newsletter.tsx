import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, User } from 'lucide-react';
import newsData from '@/lib/news-articles.json';
import Link from 'next/link';

const newsletters = newsData.newsletters;

export function Newsletter() {
  return (
    <section id="news" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Latest News</h2>
          <p className="text-muted-foreground mt-2">Stay up-to-date with the latest from Tamil Pasanga.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsletters.slice(0, 3).map((item) => {
            const image = PlaceHolderImages.find(img => img.id === item.imageId);
            return (
              <Card key={item.id} className="flex flex-col bg-card border-border/50 shadow-lg overflow-hidden hover:shadow-primary/20 transition-shadow duration-300">
                {image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {item.author}</span>
                  </div>
                </CardContent>
                <CardFooter>
                   <Button variant="link" className="text-primary p-0" asChild>
                    <Link href={`/admin/news/edit/${item.id}`}>Read More &rarr;</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
                <Link href="/news">View All News</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}

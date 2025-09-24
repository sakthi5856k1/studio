
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/news-articles';

type NewsletterProps = {
  articles: (NewsArticle & {
    imageUrl?: string;
    imageDescription?: string;
    imageHint?: string;
  })[];
};

const ChristmasCap = () => (
  <Image
    src="https://skit.ng/wp-content/uploads/2023/12/Christmas-Hats-Skit-Store.webp"
    alt="Christmas Cap"
    width={60}
    height={60}
    className="absolute -top-6 -right-5 z-10 transform rotate-[15deg]"
  />
);

export function Newsletter({ articles }: NewsletterProps) {
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});

  const toggleReadMore = (articleId: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  return (
    <section id="news" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Latest News</h2>
          <p className="text-muted-foreground mt-2">Stay up-to-date with the latest from Tamil Pasanga.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item) => {
            const isExpanded = expandedArticles[item.id];
            return (
              <Card key={item.id} className="relative overflow-visible flex flex-col bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                <ChristmasCap />
                {item.imageUrl && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageDescription || ''}
                      fill
                      className="object-cover"
                      data-ai-hint={item.imageHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                  <p className={cn("mb-4", !isExpanded && "line-clamp-3")}>{item.description}</p>
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
                   <Button variant="link" className="text-primary p-0" onClick={() => toggleReadMore(item.id)}>
                      {isExpanded ? 'Read Less' : 'Read More'} &rarr;
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

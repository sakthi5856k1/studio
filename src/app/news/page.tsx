import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Calendar, User } from 'lucide-react';
import newsData from '@/lib/news-articles.json';
import Link from 'next/link';

const newsletters = newsData.newsletters;

const ChristmasCap = () => (
  <Image
    src="https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826"
    alt="Christmas Cap"
    width={60}
    height={60}
    className="absolute -top-6 -right-5 z-10 transform rotate-[15deg]"
  />
);

export default function AllNewsPage() {
  const bannerImage = PlaceHolderImages.find(img => img.id === 'create-news-banner');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="relative h-64 w-full">
            {bannerImage && (
                <Image
                src={bannerImage.imageUrl}
                alt={bannerImage.description}
                fill
                className="object-cover"
                data-ai-hint={bannerImage.imageHint}
                />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <h1 className="text-4xl font-headline text-white">News Archive</h1>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsletters.map((item) => {
                const image = PlaceHolderImages.find(img => img.id === item.imageId);
                return (
                <Card key={item.id} className="relative overflow-visible flex flex-col bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                    <ChristmasCap />
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
                    <p className="mb-4">{item.description}</p>
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
                        {/* This link can be updated later to point to a full article page */}
                        <Link href="#">Read More &rarr;</Link>
                    </Button>
                    </CardFooter>
                </Card>
                );
            })}
            </div>
             <div className="mt-12 text-center">
                <Button variant="outline" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const staffMembers = [
    {
        name: 'Powerful Gaming',
        role: 'Founder',
        imageId: 'testimonial-avatar',
    },
    {
        name: 'Sakthi',
        role: 'Managing Director',
        imageId: 'testimonial-avatar',
    },
    {
        name: 'GHOST',
        role: 'Human Resources',
        imageId: 'testimonial-avatar',
    },
];

const bannerImageUrl = "https://cdn.discordapp.com/attachments/1281551151418048677/1414862372199202927/ets2_20250907_201945_00.PNG?ex=68d43a84&is=68d2e904&hm=c6a185bd254316fdb29cdd8e8f8255b85a60a3760da66ed8f10813dc2d90e01b&";

export default function StaffPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="relative h-64 w-full">
            <Image
                src={bannerImageUrl}
                alt="Staff Banner"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-headline text-white">Our Staff</h1>
                    <p className="text-muted-foreground mt-2 text-white/80">The team that makes it all happen.</p>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {staffMembers.map((member) => {
                 const image = PlaceHolderImages.find(img => img.id === member.imageId);
                 return (
                    <Card key={member.name} className="text-center bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                        <CardHeader className="items-center">
                            {image && (
                                <Image
                                    src={image.imageUrl}
                                    alt={`Photo of ${member.name}`}
                                    width={120}
                                    height={120}
                                    className="rounded-full border-4 border-primary"
                                    data-ai-hint={image.imageHint}
                                />
                            )}
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="font-headline text-xl">{member.name}</CardTitle>
                            <p className="text-primary">{member.role}</p>
                        </CardContent>
                    </Card>
                 )
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


import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import galleryData from '@/lib/gallery-images.json';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const images = galleryData.galleryImages;
const bannerImageUrl = "https://cdn.discordapp.com/attachments/1281551151418048677/1414862372199202927/ets2_20250907_201945_00.PNG?ex=68d43a84&is=68d2e904&hm=c6a185bd254316fdb29cdd8e8f8255b85a60a3760da66ed8f10813dc2d90e01b&";


export default function GalleryPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                 <div className="relative h-64 w-full">
                    <Image
                        src={bannerImageUrl}
                        alt="Gallery Banner"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-4xl font-headline text-white">Our Gallery</h1>
                            <p className="text-muted-foreground mt-2 text-white/80">A collection of our best moments.</p>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((image) => (
                            <Card key={image.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/40">
                                <div className="relative aspect-video">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.id}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </Card>
                        ))}
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

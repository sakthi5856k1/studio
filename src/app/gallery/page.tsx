
'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { GalleryImage } from '@/lib/gallery-images';
import galleryData from '@/lib/gallery-images.json';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const bannerImageUrl = "https://cdn.discordapp.com/attachments/1281551151418048677/1414862372199202927/ets2_20250907_201945_00.PNG?ex=68d43a84&is=68d2e904&hm=c6a185bd254316fdb29cdd8e8f8255b85a60a3760da66ed8f10813dc2d90e01b&";

export default function GalleryPage() {
    const images: GalleryImage[] = galleryData.galleryImages;
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const openLightbox = (index: number) => {
        setSelectedImageIndex(index);
    };

    const closeLightbox = () => {
        setSelectedImageIndex(null);
    };

    const goToNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % images.length);
        }
    };

    const goToPrev = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + images.length) % images.length);
        }
    };

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (selectedImageIndex !== null) {
            intervalRef.current = setInterval(() => {
                goToNext();
            }, 3000); // Autoplay every 3 seconds
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [selectedImageIndex, images.length]);
    
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {images.map((image, index) => (
                            <Card key={image.id} className="overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-primary/40">
                                <div className="relative aspect-video cursor-pointer" onClick={() => openLightbox(index)}>
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.id}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
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

            {selectedImageIndex !== null && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeLightbox}>
                    <div className="relative w-full h-full max-w-4xl max-h-4/5" onClick={(e) => e.stopPropagation()}>
                         {images[selectedImageIndex] && (
                            <Image
                                key={images[selectedImageIndex].id}
                                src={images[selectedImageIndex].imageUrl}
                                alt={images[selectedImageIndex].id}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-lg"
                            />
                        )}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                         <button onClick={closeLightbox} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
                            <X size={24} />
                        </button>
                        <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
                            <ChevronLeft size={32} />
                        </button>
                        <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

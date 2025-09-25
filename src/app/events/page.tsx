
'use client';

import { useState } from 'react';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Event } from '@/lib/events';
import eventsData from '@/lib/events.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const bannerImage = PlaceHolderImages.find(p => p.id === 'events-banner');

const EventCard = ({ event, onImageClick }: { event: Event, onImageClick: () => void }) => {
    const image = PlaceHolderImages.find(p => p.id === event.imageId);
    const linkHref = event.type === 'partner' ? event.url : `/events/${event.id}`;
    
    return (
        <Card className="bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col group">
            {image && (
                <div className="relative h-40 w-full cursor-pointer" onClick={onImageClick}>
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={image.imageHint}
                    />
                </div>
            )}
            <CardContent className="p-4 flex-grow flex flex-col">
                <h3 className="font-headline text-lg mb-2 flex-grow">{event.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                </div>
                <Button asChild className="w-full">
                    <Link href={linkHref} target={event.type === 'partner' ? '_blank' : '_self'}>
                        {event.type === 'internal' ? 'Slot Booking' : 'View Event'}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};


export default function EventsPage() {
    const allEvents = eventsData.events;
    const upcomingEvents = allEvents.filter(e => e.type === 'internal');
    const partnerEvents = allEvents.filter(e => e.type === 'partner');
    
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const goToNext = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prevIndex) => (prevIndex! + 1) % allEvents.length);
        }
    };

    const goToPrev = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex((prevIndex) => (prevIndex! - 1 + allEvents.length) % allEvents.length);
        }
    };
    
    const lightboxImageId = lightboxIndex !== null ? allEvents[lightboxIndex].imageId : null;
    const lightboxImage = PlaceHolderImages.find(p => p.id === lightboxImageId);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                {bannerImage &&
                    <div className="relative h-64 w-full">
                        <Image
                            src={bannerImage.imageUrl}
                            alt={bannerImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={bannerImage.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <h1 className="text-4xl font-headline text-white">Our Events</h1>
                        </div>
                    </div>
                }

                <div className="container mx-auto px-4 py-16">
                    <section id="upcoming-events" className="mb-16">
                        <h2 className="text-3xl font-headline text-center mb-8 text-primary">Upcoming Tamil Pasanga Events</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map(event => {
                                const overallIndex = allEvents.findIndex(e => e.id === event.id);
                                return (
                                    <EventCard key={event.id} event={event} onImageClick={() => openLightbox(overallIndex)} />
                                );
                            })}
                        </div>
                    </section>

                    <section id="partner-events">
                        <h2 className="text-3xl font-headline text-center mb-8 text-primary">Where We'll Be Next</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                             {partnerEvents.map(event => {
                                const overallIndex = allEvents.findIndex(e => e.id === event.id);
                                return (
                                    <EventCard key={event.id} event={event} onImageClick={() => openLightbox(overallIndex)} />
                                );
                             })}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
            
             {lightboxIndex !== null && lightboxImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={closeLightbox}>
                    <div className="relative w-full h-full max-w-4xl max-h-4/5" onClick={(e) => e.stopPropagation()}>
                         <Image
                            key={lightboxImage.id}
                            src={lightboxImage.imageUrl}
                            alt={lightboxImage.description}
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                            {lightboxIndex + 1} / {allEvents.length}
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


import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
import type { Event } from '@/lib/events';
import eventsData from '@/lib/events.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const bannerImage = PlaceHolderImages.find(p => p.id === 'events-banner');

const EventCard = ({ event }: { event: Event }) => {
    const image = PlaceHolderImages.find(p => p.id === event.imageId);
    return (
        <Card className="bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300 flex flex-col">
            {image && (
                <div className="relative h-40 w-full">
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover rounded-t-lg"
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
                    <Link href={event.url} target="_blank">
                        {event.type === 'internal' ? 'Slot Booking' : 'View Event'}
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};


export default function EventsPage() {
    const upcomingEvents = eventsData.events.filter(e => e.type === 'internal');
    const partnerEvents = eventsData.events.filter(e => e.type === 'partner');

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
                            {upcomingEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>

                    <section id="partner-events">
                        <h2 className="text-3xl font-headline text-center mb-8 text-primary">Where We'll Be Next</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                             {partnerEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}


import { notFound } from 'next/navigation';
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
    Clock,
    MapPin,
    Users,
    ChevronRight,
    Calendar,
    Globe,
    Map,
} from 'lucide-react';
import eventsData from '@/lib/events.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getEvent = (id: string) => {
    return eventsData.events.find(event => event.id === id);
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
    const event = getEvent(params.id);

    if (!event) {
        notFound();
    }

    const image = PlaceHolderImages.find(p => p.id === event.imageId);
    
    // Calculate statistics
    const confirmedAttendees = event.slots?.reduce((total, area) => {
        return total + (area.bookings?.filter(b => b.status === 'approved').length || 0);
    }, 0) || 0;

    const participatingVtcs = event.slots?.reduce((total, area) => {
        const approvedVtcs = area.bookings?.filter(b => b.status === 'approved').length || 0;
        return total + approvedVtcs;
    }, 0) || 0;


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                {/* Banner Section */}
                <div className="relative h-[40vh] w-full text-white">
                    {image && (
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute bottom-0 left-0 container mx-auto px-4 py-8">
                        <h1 className="text-4xl font-headline font-bold mb-2">{event.title}</h1>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-bold"> <Clock size={12}/> UPCOMING</span>
                            <span className="flex items-center gap-1 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs font-bold"><Users size={12}/> {confirmedAttendees} attending</span>
                            <span className="flex items-center gap-1"><MapPin size={14}/> {event.departure} <ChevronRight size={14} /> {event.arrival}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Calendar size={20}/> Event Schedule</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Meetup Time</p>
                                        <p className="text-muted-foreground">{event.meetupTime}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Departure Time</p>
                                        <p className="text-muted-foreground">{event.departureTime}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><MapPin size={20}/> Route Details</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold">Departure</p>
                                        <p className="text-muted-foreground">{event.departure}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Arrival</p>
                                        <p className="text-muted-foreground">{event.arrival}</p>
                                    </div>
                                     <div className="col-span-2">
                                        <p className="font-semibold">Server</p>
                                        <p className="text-muted-foreground">{event.server}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="description">
                                    <AccordionTrigger>Event Description</AccordionTrigger>
                                    <AccordionContent>
                                        {event.description}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="rules">
                                    <AccordionTrigger>Event Rules</AccordionTrigger>
                                    <AccordionContent>
                                       {event.rules}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="space-y-8">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button asChild className="w-full" variant="outline"><Link href={event.url} target="_blank"><Globe/> Visit Event Website</Link></Button>
                                    <Button asChild className="w-full" variant="outline"><Link href="#" target="_blank"><Map/> View Route Map</Link></Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Statistics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <p>Confirmed Attendees</p>
                                        <p className="font-bold">{confirmedAttendees}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p>VTCs Participating</p>
                                        <p className="font-bold">{participatingVtcs}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

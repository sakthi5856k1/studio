
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
    BadgeCheck,
    Truck,
    Mic,
    Globe,
    Map,
} from 'lucide-react';
import eventsData from '@/lib/events.json';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getEvent = (id: string) => {
    return eventsData.events.find(event => event.id === id);
}

const DiscordIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" >
      <path d="M20.317 4.36981C18.7915 3.72551 17.1857 3.28682 15.5292 3.09602C15.4239 3.36442 15.2891 3.72551 15.1838 3.99391C13.2435 3.63282 11.3159 3.63282 9.3883 3.99391C9.2702 3.72551 9.1355 3.36442 9.0302 3.09602C7.37371 3.28682 5.76792 3.72551 4.24243 4.36981C1.6917 8.16112 1.03961 11.898 1.9427 15.5422C3.73711 16.9832 5.56092 17.9351 7.42433 18.5794C7.79523 18.2183 8.13672 17.8315 8.44882 17.4191C8.01422 17.1801 7.59242 16.9283 7.18342 16.66C7.03851 16.5413 6.89361 16.4226 6.74871 16.2911C6.71931 16.2655 6.67711 16.2399 6.64771 16.2142C6.64771 16.2142 6.63501 16.2014 6.62221 16.1887C8.42931 17.3015 10.3862 17.9057 12.4173 17.9057C14.4483 17.9057 16.4052 17.3015 18.2124 16.1887C18.2007 16.2004 18.188 16.2142 18.188 16.2142C18.1586 16.2399 18.1164 16.2655 18.087 16.2911C17.9421 16.4226 17.7972 16.5413 17.6523 16.66C17.2433 16.9283 16.8215 17.1801 16.3869 17.4191C16.7118 17.8315 17.0405 18.2183 17.4114 18.5794C19.2748 17.9351 21.0986 16.9832 22.893 15.5422C23.8357 11.4593 23.0118 7.74971 20.317 4.36981ZM9.68069 13.848C8.68989 13.848 7.88939 12.9158 7.88939 11.783C7.88939 10.6502 8.67709 9.718 9.68069 9.718C10.6843 9.718 11.4848 10.6502 11.472 11.783C11.472 12.9158 10.6843 13.848 9.68069 13.848ZM14.8517 13.848C13.8609 13.848 13.0604 12.9158 13.0604 11.783C13.0604 10.6502 13.8481 9.718 14.8517 9.718C15.8553 9.718 16.6558 10.6502 16.643 11.783C16.643 12.9158 15.8553 13.848 14.8517 13.848Z" />
    </svg>
  );

export default function EventDetailPage({ params }: { params: { id: string } }) {
    const event = getEvent(params.id);

    if (!event) {
        notFound();
    }

    const image = PlaceHolderImages.find(p => p.id === event.imageId);

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
                            <span className="flex items-center gap-1 bg-green-500/80 text-white px-3 py-1 rounded-full text-xs font-bold"><Users size={12}/> {event.attendees} attending</span>
                            <span className="flex items-center gap-1"><MapPin size={14}/> {event.departure} <ChevronRight size={14} /> {event.arrival}</span>
                            <span className="flex items-center gap-1"><Truck size={14}/> {event.server}</span>
                        </div>
                        <Button className="mt-4">Book Slot</Button>
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
                                        <p className="font-semibold">Meetup Time (UTC)</p>
                                        <p className="text-muted-foreground">{event.meetupTime}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Departure Time (UTC)</p>
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
                                    <Button asChild className="w-full" variant="outline"><Link href="/api/redirect/voice-chat" target="_blank"><Mic/> Join Voice Chat</Link></Button>
                                    <Button asChild className="w-full" variant="outline"><Link href={event.url} target="_blank"><Globe/> Visit Event Website</Link></Button>
                                    <Button asChild className="w-full" variant="secondary"><Link href={event.url} target="_blank"><BadgeCheck/> Click here to book slots</Link></Button>
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
                                        <p className="font-bold">{event.attendees}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p>VTCs Participating</p>
                                        <p className="font-bold">{event.vtcs}</p>
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

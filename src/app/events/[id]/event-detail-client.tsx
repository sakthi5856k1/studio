
'use client';

import { useState } from 'react';
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
    X,
} from 'lucide-react';
import type { Event } from '@/lib/events';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type EventWithImage = Event & { image: ImagePlaceholder | undefined };

export function EventDetailClient({ event }: { event: EventWithImage }) {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const { image } = event;
    
    const confirmedAttendees = event.slots?.reduce((total, area) => {
        return total + (area.bookings?.filter(b => b.status === 'approved').length || 0);
    }, 0) || 0;

    const participatingVtcs = event.slots?.reduce((total, area) => {
        const approvedVtcs = area.bookings?.filter(b => b.status === 'approved').length || 0;
        return total + approvedVtcs;
    }, 0) || 0;
    
    const totalFreeSlots = event.slots?.reduce((total, area) => {
        const totalInArea = (area.endSlot - area.startSlot + 1);
        const bookedInArea = area.bookings?.filter(b => b.status === 'approved').length || 0;
        return total + (totalInArea - bookedInArea);
    }, 0) || 0;

    return (
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
                                {event.routeMapUrl && (
                                    <Button asChild className="w-full" variant="outline"><Link href={event.routeMapUrl} target="_blank"><Map/> View Route Map</Link></Button>
                                )}
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

                {event.slots && event.slots.length > 0 && (
                    <section id="event-slots" className="mt-16">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-3xl font-headline text-primary">Event Slots</h2>
                            <p className="text-muted-foreground font-bold">{totalFreeSlots} free slots available</p>
                        </div>
                        <p className="text-center text-muted-foreground mb-8">Come back after sometime to check your slot&apos;s booking status!</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {event.slots.map(area => {
                                const totalSlots = area.endSlot - area.startSlot + 1;
                                const bookedSlots = area.bookings?.filter(b => b.status === 'approved').length || 0;
                                const availableSlots = totalSlots - bookedSlots;
                                const allSlotNumbers = Array.from({ length: totalSlots }, (_, i) => area.startSlot + i);

                                return (
                                    <Card key={area.id} className="bg-card/80 border-border/50 shadow-lg flex flex-col">
                                        <CardHeader className="p-0">
                                            <div className="relative aspect-video cursor-pointer" onClick={() => setLightboxImage(area.imageUrl)}>
                                                <Image
                                                    src={area.imageUrl}
                                                    alt={area.areaName}
                                                    fill
                                                    className="object-cover rounded-t-lg"
                                                />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 flex-grow flex flex-col">
                                            <p className="text-center text-sm text-primary mb-2">Click on the image to view</p>
                                            <div className="flex justify-center gap-2 mb-4">
                                                <Badge variant={availableSlots > 0 ? 'default' : 'destructive'} className={cn(availableSlots > 0 && 'bg-green-500')}>
                                                    {availableSlots} slots available
                                                </Badge>
                                                <Badge variant="secondary">{totalSlots} total slots</Badge>
                                            </div>

                                            <div className="mb-4">
                                                <p className="font-semibold mb-2">Slot Numbers:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {allSlotNumbers.map(num => (
                                                        <Badge key={num} variant="outline" className="border-primary text-primary">#{num}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="flex-grow mb-4">
                                                <p className="font-semibold mb-2">Bookings:</p>
                                                <div className="space-y-2 text-sm">
                                                    {area.bookings && area.bookings.length > 0 ? area.bookings.map(booking => (
                                                        <div key={booking.id}>
                                                            <p className="font-medium">#{booking.slotNumber}: {booking.vtcName}</p>
                                                            <Badge variant="default" className="bg-green-600 text-xs mt-1">{booking.status}</Badge>
                                                        </div>
                                                    )) : <p className="text-muted-foreground">No bookings yet.</p>}
                                                </div>
                                            </div>

                                            <Button className="w-full mt-auto" disabled={availableSlots === 0}>
                                                {availableSlots > 0 ? 'Request Slot' : 'No Slots Available'}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
            {lightboxImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setLightboxImage(null)}>
                    <div className="relative w-full h-full max-w-6xl max-h-[90%]" onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={lightboxImage}
                            alt="Slot Map Lightbox"
                            fill
                            objectFit="contain"
                            className="rounded-lg"
                        />
                        <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

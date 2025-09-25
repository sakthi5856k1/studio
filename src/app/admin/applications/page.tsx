
'use client';

import React, { useState, useEffect } from 'react';
import { Footer } from "@/components/app/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Application } from "@/lib/applications";
import { CheckCircle, Clock, FileText, MoreHorizontal, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { UpdateApplicationStatus, UpdateBookingStatus } from "./actions";
import { getApplications, getEventsWithBookings } from './server-actions';
import { Skeleton } from '@/components/ui/skeleton';
import type { Event } from '@/lib/events';

const statusInfo = {
    Accepted: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, badge: <Badge variant="default" className="bg-green-500">Accepted</Badge> },
    Pending: { icon: <Clock className="h-4 w-4 text-yellow-500" />, badge: <Badge variant="secondary" className="bg-yellow-500">Pending</Badge> },
    Rejected: { icon: <XCircle className="h-4 w-4 text-red-500" />, badge: <Badge variant="destructive">Rejected</Badge> },
    Interview: { icon: <AlertCircle className="h-4 w-4 text-blue-500" />, badge: <Badge className="bg-blue-500">Interview</Badge> },
};

function ApplicationRow({ app }: { app: Application }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="group">
                        <ChevronDown className={isOpen ? "hidden" : "h-4 w-4"} />
                        <ChevronUp className={isOpen ? "h-4 w-4" : "hidden"} />
                    </Button>
                </TableCell>
                <TableCell className="font-medium">{app.id}</TableCell>
                <TableCell>{app.name}</TableCell>
                <TableCell>{app.discordTag}</TableCell>
                <TableCell>{format(new Date(app.submittedAt), 'PPp')}</TableCell>
                <TableCell>{statusInfo[app.status]?.badge || app.status}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <UpdateApplicationStatus applicationId={app.id} status="Accepted" currentStatus={app.status} />
                            <UpdateApplicationStatus applicationId={app.id} status="Rejected" currentStatus={app.status} />
                            <UpdateApplicationStatus applicationId={app.id} status="Interview" currentStatus={app.status} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            {isOpen && (
                <TableRow className="bg-muted/50">
                    <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Email:</strong> {app.email}</div>
                            <div><strong>Experience:</strong> <span className="capitalize">{app.experience}</span></div>
                            <div>
                                <strong>Steam Profile:</strong>
                                <Link href={app.steamUrl} target="_blank" className="text-primary hover:underline ml-2">View Profile</Link>
                            </div>
                            <div className="col-span-full">
                                <strong>How they found us:</strong> <span className="capitalize">{app.howYouFound}</span>
                                {app.howYouFound === 'friends' && app.friendsMention && ` - ${app.friendsMention}`}
                                {app.howYouFound === 'others' && app.othersMention && ` - ${app.othersMention}`}
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
}

function BookingRow({ event, area, booking }: { event: Event; area: NonNullable<Event['slots']>[0]; booking: NonNullable<NonNullable<Event['slots']>[0]['bookings']>[0] }) {
  return (
     <TableRow>
        <TableCell></TableCell>
        <TableCell className="font-medium">{booking.id}</TableCell>
        <TableCell>{booking.vtcName}</TableCell>
        <TableCell>{event.title}</TableCell>
        <TableCell>Slot #{booking.slotNumber} ({area.areaName})</TableCell>
        <TableCell><Badge className={booking.status === 'approved' ? 'bg-green-500' : booking.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}>{booking.status}</Badge></TableCell>
        <TableCell className="text-right">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={booking.status !== 'pending'}>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <UpdateBookingStatus eventId={event.id} areaId={area.id} bookingId={booking.id} newStatus="approved" />
                    <UpdateBookingStatus eventId={event.id} areaId={area.id} bookingId={booking.id} newStatus="rejected" />
                </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    </TableRow>
  );
}


export default function ApplicationsAdminPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [bookingEvents, setBookingEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [fetchedApplications, fetchedEvents] = await Promise.all([
                    getApplications(),
                    getEventsWithBookings()
                ]);
                setApplications(fetchedApplications);
                setBookingEvents(fetchedEvents);
            } catch (error) {
                console.error("Failed to load data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);
    
    const allBookings = bookingEvents.flatMap(event => 
        event.slots?.flatMap(area => 
            area.bookings?.map(booking => ({ event, area, booking })) || []
        ) || []
    );


    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-headline flex items-center gap-2">
                            <FileText />
                            Manage Applications & Bookings
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Applications</CardTitle>
                            <CardDescription>
                                {isLoading ? 'Loading applications...' : `${applications.length} application(s) found.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Discord Tag</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array.from({ length: 5 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={7}>
                                                    <Skeleton className="h-8 w-full" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        applications.map((app) => (
                                            <ApplicationRow key={app.id} app={app} />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                    
                     <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Slot Booking Requests</CardTitle>
                            <CardDescription>
                                {isLoading ? 'Loading booking requests...' : `${allBookings.length} booking request(s) found.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12"></TableHead>
                                        <TableHead>Booking ID</TableHead>
                                        <TableHead>VTC Name</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Slot</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                     {isLoading ? (
                                        Array.from({ length: 3 }).map((_, index) => (
                                            <TableRow key={`booking-skel-${index}`}>
                                                <TableCell colSpan={7}>
                                                    <Skeleton className="h-8 w-full" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : allBookings.length > 0 ? (
                                        allBookings.map(({ event, area, booking }) => (
                                            <BookingRow key={booking.id} event={event} area={area} booking={booking} />
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center">No booking requests found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                     <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/admin">Back to Admin</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

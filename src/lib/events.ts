
export type Booking = {
    id: string;
    slotNumber: number;
    vtcName: string;
    status: 'approved' | 'pending' | 'rejected';
};

export type SlotArea = {
    id: string;
    areaName: string;
    imageUrl: string;
    startSlot: number;
    endSlot: number;
    bookings: Booking[];
};

export type Event = {
    id: string;
    title: string;
    date: string;
    imageId: string;
    url: string;
    routeMapUrl?: string;
    type: 'internal' | 'partner';
    attendees: number;
    vtcs: number;
    departure: string;
    arrival: string;
    server: string;
    meetupTime: string;
    departureTime: string;
    description: string;
    rules: string;
    slots?: SlotArea[];
};

export type EventsData = {
    events: Event[];
};

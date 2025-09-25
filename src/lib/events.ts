
export type Event = {
    id: string;
    title: string;
    date: string;
    imageId: string;
    url: string;
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
};

export type EventsData = {
    events: Event[];
};


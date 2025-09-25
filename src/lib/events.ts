
export type Event = {
    id: string;
    title: string;
    date: string;
    imageId: string;
    url: string;
    type: 'internal' | 'partner';
};

export type EventsData = {
    events: Event[];
};

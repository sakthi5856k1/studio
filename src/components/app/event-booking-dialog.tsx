
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EventBookingForm } from './event-booking-form';
import type { SlotArea } from '@/lib/events';

type EventBookingDialogProps = {
  eventId: string;
  area: SlotArea;
  availableSlots: number[];
  children: React.ReactNode;
};

export function EventBookingDialog({ eventId, area, availableSlots, children }: EventBookingDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Request a Slot for {area.areaName}</DialogTitle>
        </DialogHeader>
        <EventBookingForm 
            onFormSubmit={() => setOpen(false)} 
            eventId={eventId}
            areaId={area.id}
            availableSlots={availableSlots}
        />
      </DialogContent>
    </Dialog>
  );
}

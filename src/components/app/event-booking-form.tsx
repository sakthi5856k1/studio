
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { submitBooking } from '@/app/events/[id]/actions';


const bookingFormSchema = z.object({
  discordId: z.string().min(1, 'Discord ID is required'),
  vtcName: z.string().min(1, 'VTC Name is required'),
  position: z.string().min(1, 'Position is required'),
  estimatedDrivers: z.coerce.number().min(1, 'Estimated drivers must be at least 1'),
  truckersmpUrl: z.string().url('A valid TruckersMP URL is required'),
  slotNumber: z.coerce.number({invalid_type_error: "Please select a slot"}).min(1, 'Please select a slot'),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

type EventBookingFormProps = {
    onFormSubmit: () => void;
    eventId: string;
    areaId: string;
    availableSlots: number[];
};

export function EventBookingForm({ onFormSubmit, eventId, areaId, availableSlots }: EventBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      discordId: '',
      vtcName: '',
      position: 'Event Manager',
      estimatedDrivers: 1,
      truckersmpUrl: '',
    },
  });


  async function onSubmit(data: BookingFormValues) {
    setIsSubmitting(true);
    const result = await submitBooking({ ...data, eventId, areaId });
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Slot Request Submitted',
        description: result.message,
      });
      form.reset();
      onFormSubmit();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'An error occurred',
      });
    }
  }


  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="discordId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. username or 123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vtcName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your VTC Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tamil Pasanga" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position in VTC</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Event Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="estimatedDrivers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Drivers</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <FormField
              control={form.control}
              name="truckersmpUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TruckersMP Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://truckersmp.com/vtc/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="slotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Slot</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Choose Slot --" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {availableSlots.map(slot => (
                            <SelectItem key={slot} value={String(slot)}>Slot #{slot}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          <Button type="submit" className="w-full rounded-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...</> : 'Request Slot'}
          </Button>
        </form>
      </Form>
  );
}

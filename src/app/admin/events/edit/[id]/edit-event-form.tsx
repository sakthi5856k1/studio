
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateEvent, type Event } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bookingSchema = z.object({
  id: z.string(),
  slotNumber: z.coerce.number(),
  vtcName: z.string(),
  status: z.enum(['approved', 'pending', 'rejected']),
});

const slotAreaSchema = z.object({
  id: z.string(),
  areaName: z.string().min(1, 'Area name is required'),
  imageUrl: z.string().url('Image URL must be a valid URL'),
  totalSlots: z.coerce.number().min(1, 'Total slots must be at least 1'),
  bookings: z.array(bookingSchema),
});

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  imageId: z.string().min(1, 'An image ID is required'),
  url: z.string().url('Must be a valid URL'),
  type: z.enum(['internal', 'partner']),
  attendees: z.coerce.number().min(0),
  vtcs: z.coerce.number().min(0),
  departure: z.string().min(1, 'Departure location is required'),
  arrival: z.string().min(1, 'Arrival location is required'),
  server: z.string().min(1, 'Server is required'),
  meetupTime: z.string().min(1, 'Meetup time is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  description: z.string().min(1, 'Description is required'),
  rules: z.string().min(1, 'Rules are required'),
  slots: z.array(slotAreaSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const eventImageOptions = PlaceHolderImages.filter(img => img.id.startsWith('event-'));

export function EditEventForm({ event }: { event: Event }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...event,
      slots: event.slots || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slots",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await updateEvent(event.id, values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Event details updated successfully.",
      });
      router.push("/admin/events");
      router.refresh(); 
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.message || "An error occurred.",
      });
    }
  }

  return (
    <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Event Title</FormLabel> <FormControl> <Input placeholder="Enter event title" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="date" render={({ field }) => ( <FormItem> <FormLabel>Event Date</FormLabel> <FormControl> <Input placeholder="e.g., DD.MM.YYYY | HH:MM UTC" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="imageId" render={({ field }) => ( <FormItem> <FormLabel>Event Image</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select an image" /> </SelectTrigger> </FormControl> <SelectContent> {eventImageOptions.map(image => ( <SelectItem key={image.id} value={image.id}>{image.description}</SelectItem> ))} </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="url" render={({ field }) => ( <FormItem> <FormLabel>Event URL</FormLabel> <FormControl> <Input placeholder="https://truckersmp.com/..." {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Event Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl> <SelectTrigger> <SelectValue placeholder="Select event type" /> </SelectTrigger> </FormControl> <SelectContent> <SelectItem value="internal">Internal</SelectItem> <SelectItem value="partner">Partner</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="server" render={({ field }) => ( <FormItem> <FormLabel>Server</FormLabel> <FormControl> <Input placeholder="e.g., Event Server" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="departure" render={({ field }) => ( <FormItem> <FormLabel>Departure</FormLabel> <FormControl> <Input placeholder="e.g., Bremen" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="arrival" render={({ field }) => ( <FormItem> <FormLabel>Arrival</FormLabel> <FormControl> <Input placeholder="e.g., Prague" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="meetupTime" render={({ field }) => ( <FormItem> <FormLabel>Meetup Time</FormLabel> <FormControl> <Input placeholder="e.g., 10-Oct-2025 20:30" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="departureTime" render={({ field }) => ( <FormItem> <FormLabel>Departure Time</FormLabel> <FormControl> <Input placeholder="e.g., 10-Oct-2025 21:30" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="attendees" render={({ field }) => ( <FormItem> <FormLabel>Attendees</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 100" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          <FormField control={form.control} name="vtcs" render={({ field }) => ( <FormItem> <FormLabel>VTCs</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 30" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl> <Textarea placeholder="Enter a description for the event" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        <FormField control={form.control} name="rules" render={({ field }) => ( <FormItem> <FormLabel>Rules</FormLabel> <FormControl> <Textarea placeholder="Enter the rules for the event" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
        
        <Card>
            <CardHeader>
                <CardTitle>Event Slots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {fields.map((field, index) => (
                    <Card key={field.id} className="p-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name={`slots.${index}.areaName`} render={({ field }) => ( <FormItem> <FormLabel>Area Name</FormLabel> <FormControl> <Input placeholder="e.g., Main Parking" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                            <FormField control={form.control} name={`slots.${index}.totalSlots`} render={({ field }) => ( <FormItem> <FormLabel>Total Slots</FormLabel> <FormControl> <Input type="number" placeholder="e.g., 10" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                        </div>
                         <FormField control={form.control} name={`slots.${index}.imageUrl`} render={({ field }) => ( <FormItem className="mt-4"> <FormLabel>Image URL</FormLabel> <FormControl> <Input placeholder="https://example.com/slot-map.png" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </Card>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ id: `slot-area-${Date.now()}`, areaName: '', imageUrl: '', totalSlots: 1, bookings: [] })}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Slot Area
                </Button>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
            <Button variant="outline" asChild> <Link href="/admin/events">Cancel</Link> </Button>
            <Button type="submit" disabled={isSubmitting}> {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"} </Button>
        </div>
      </form>
    </Form>
  );
}

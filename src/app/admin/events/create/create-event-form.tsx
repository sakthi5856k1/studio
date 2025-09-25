
"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
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
import { createEvent } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarIcon, Loader2, PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
  startSlot: z.coerce.number().min(1, 'Start slot must be at least 1'),
  endSlot: z.coerce.number().min(1, 'End slot must be at least 1'),
  bookings: z.array(bookingSchema),
}).refine(data => data.endSlot >= data.startSlot, {
    message: "End slot must be greater than or equal to start slot",
    path: ["endSlot"],
});

const timeSchema = z.object({
  hour: z.string().min(1, { message: 'HH' }).max(2),
  minute: z.string().min(1, { message: 'MM' }).max(2),
  timezone: z.string().min(1, { message: 'Zone' })
});

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventDate: z.date({ required_error: "An event date is required." }),
  imageUrl: z.string().url('Must be a valid URL'),
  url: z.string().url('Must be a valid URL'),
  routeMapUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  type: z.enum(['internal', 'partner'], {
    errorMap: () => ({ message: 'Please select an event type' }),
  }),
  departure: z.string().optional(),
  arrival: z.string().optional(),
  server: z.string().optional(),
  meetupTime: timeSchema,
  departureTime: timeSchema,
  description: z.string().optional(),
  rules: z.string().optional(),
  slots: z.array(slotAreaSchema).optional(),
}).superRefine((data, ctx) => {
    if (data.type === 'internal') {
        if (!data.departure) ctx.addIssue({ code: 'custom', message: 'Departure is required', path: ['departure'] });
        if (!data.arrival) ctx.addIssue({ code: 'custom', message: 'Arrival is required', path: ['arrival'] });
        if (!data.server) ctx.addIssue({ code: 'custom', message: 'Server is required', path: ['server'] });
        if (!data.description) ctx.addIssue({ code: 'custom', message: 'Description is required', path: ['description'] });
        if (!data.rules) ctx.addIssue({ code: 'custom', message: 'Rules are required', path: ['rules'] });
    }
});


type FormValues = z.infer<typeof formSchema>;

export function CreateEventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      url: "",
      routeMapUrl: "",
      type: "internal",
      departure: "",
      arrival: "",
      server: "",
      meetupTime: { hour: '13', minute: '00', timezone: 'UTC' },
      departureTime: { hour: '13', minute: '30', timezone: 'UTC' },
      description: "",
      rules: "Follow all TruckersMP rules. No reckless driving. Keep a safe distance.",
      slots: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "slots",
  });
  
  const eventType = useWatch({
    control: form.control,
    name: "type",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await createEvent(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Event created successfully.",
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
        <FormField control={form.control} name="type" render={({ field }) => ( <FormItem> <FormLabel>Event Type</FormLabel> <Select onValueChange={field.onChange} defaultValue={field.value}> <FormControl><SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger></FormControl> <SelectContent> <SelectItem value="internal">Internal</SelectItem> <SelectItem value="partner">Partner</SelectItem> </SelectContent> </Select> <FormMessage /> </FormItem> )}/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="title" render={({ field }) => ( <FormItem> <FormLabel>Event Title</FormLabel> <FormControl><Input placeholder="Enter event title" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Event Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem> <FormLabel>Event Image URL</FormLabel> <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="url" render={({ field }) => ( <FormItem> <FormLabel>Event URL</FormLabel> <FormControl><Input placeholder="https://truckersmp.com/..." {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
        </div>
        
        {eventType === 'internal' && (
          <>
            <FormField control={form.control} name="routeMapUrl" render={({ field }) => ( <FormItem> <FormLabel>Route Map URL (Optional)</FormLabel> <FormControl><Input placeholder="https://example.com/route.png" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div/>
                <FormField control={form.control} name="server" render={({ field }) => ( <FormItem> <FormLabel>Server</FormLabel> <FormControl><Input placeholder="e.g., Event Server" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="departure" render={({ field }) => ( <FormItem> <FormLabel>Departure</FormLabel> <FormControl><Input placeholder="e.g., Bremen" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                <FormField control={form.control} name="arrival" render={({ field }) => ( <FormItem> <FormLabel>Arrival</FormLabel> <FormControl><Input placeholder="e.g., Prague" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
          </>
        )}

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem>
                <FormLabel>Meetup Time</FormLabel>
                <div className="flex items-center gap-2">
                    <FormField control={form.control} name="meetupTime.hour" render={({ field }) => (<FormItem><FormControl><Input placeholder="HH" {...field} /></FormControl></FormItem>)}/>
                    <span>:</span>
                    <FormField control={form.control} name="meetupTime.minute" render={({ field }) => (<FormItem><FormControl><Input placeholder="MM" {...field} /></FormControl></FormItem>)}/>
                    <FormField control={form.control} name="meetupTime.timezone" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="UTC">UTC</SelectItem><SelectItem value="IST">IST</SelectItem><SelectItem value="CET">CET</SelectItem></SelectContent></Select></FormItem>)}/>
                </div>
                 <FormMessage>
                    {form.formState.errors.meetupTime?.hour?.message || form.formState.errors.meetupTime?.minute?.message || form.formState.errors.meetupTime?.timezone?.message}
                </FormMessage>
            </FormItem>
             <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <div className="flex items-center gap-2">
                    <FormField control={form.control} name="departureTime.hour" render={({ field }) => (<FormItem><FormControl><Input placeholder="HH" {...field} /></FormControl></FormItem>)}/>
                    <span>:</span>
                    <FormField control={form.control} name="departureTime.minute" render={({ field }) => (<FormItem><FormControl><Input placeholder="MM" {...field} /></FormControl></FormItem>)}/>
                    <FormField control={form.control} name="departureTime.timezone" render={({ field }) => (<FormItem><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent><SelectItem value="UTC">UTC</SelectItem><SelectItem value="IST">IST</SelectItem><SelectItem value="CET">CET</SelectItem></SelectContent></Select></FormItem>)}/>
                </div>
                 <FormMessage>
                    {form.formState.errors.departureTime?.hour?.message || form.formState.errors.departureTime?.minute?.message || form.formState.errors.departureTime?.timezone?.message}
                </FormMessage>
            </FormItem>
        </div>
        
        {eventType === 'internal' && (
          <>
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem> <FormLabel>Description</FormLabel> <FormControl><Textarea placeholder="Enter a description for the event" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="rules" render={({ field }) => ( <FormItem> <FormLabel>Rules</FormLabel> <FormControl><Textarea placeholder="Enter the rules for the event" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            
            <Card>
                <CardHeader>
                    <CardTitle>Event Slots</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-4 relative">
                            <div className="space-y-4">
                                <FormField control={form.control} name={`slots.${index}.areaName`} render={({ field }) => ( <FormItem> <FormLabel>Area Name</FormLabel> <FormControl><Input placeholder="e.g., Main Parking" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name={`slots.${index}.startSlot`} render={({ field }) => ( <FormItem> <FormLabel>Start Slot</FormLabel> <FormControl><Input type="number" placeholder="e.g., 1" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                    <FormField control={form.control} name={`slots.${index}.endSlot`} render={({ field }) => ( <FormItem> <FormLabel>End Slot</FormLabel> <FormControl><Input type="number" placeholder="e.g., 10" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                                </div>
                                <FormField control={form.control} name={`slots.${index}.imageUrl`} render={({ field }) => ( <FormItem> <FormLabel>Image URL</FormLabel> <FormControl><Input placeholder="https://example.com/slot-map.png" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
                            </div>
                            <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ id: `slot-area-${Date.now()}`, areaName: '', imageUrl: '', startSlot: 1, endSlot: 10, bookings: [] })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Slot Area
                    </Button>
                </CardContent>
            </Card>
          </>
        )}

        <div className="flex justify-end gap-4">
            <Button variant="outline" asChild><Link href="/admin/events">Cancel</Link></Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Event"}</Button>
        </div>
      </form>
    </Form>
  );
}


"use client";

import { useForm } from "react-hook-form";
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
import { updateStaffMember, type StaffMember } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  steamUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  truckersmpUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions = [
    'Managing Director', 'Marketing Executive', 'Human Resource Staff', 'Trainer',
    'Event Staff', 'Event Organizer', 'Media Staff', 'Media Editor',
    'Senior Driver', 'Driver', 'Trainee'
];

export function EditStaffForm({ member }: { member: StaffMember }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name,
      role: member.role,
      imageUrl: member.imageUrl || "",
      steamUrl: member.steamUrl || "",
      truckersmpUrl: member.truckersmpUrl || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await updateStaffMember(member.id, values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Staff member details updated successfully.",
      });
      router.push("/admin/staff");
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter member's name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
               <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roleOptions.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="steamUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Steam URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://steamcommunity.com/id/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="truckersmpUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TruckersMP URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://truckersmp.com/user/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
                <Link href="/admin/staff">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
        </div>
      </form>
    </Form>
  );
}

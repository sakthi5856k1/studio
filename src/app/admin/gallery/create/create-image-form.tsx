
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
import { createGalleryImage } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  imageUrl: z.string().url("Must be a valid URL"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateImageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const result = await createGalleryImage(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Success",
        description: "Gallery image added successfully.",
      });
      router.push("/admin/gallery");
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
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
            <Button variant="outline" asChild><Link href="/admin/gallery">Cancel</Link></Button>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Image"}
            </Button>
        </div>
      </form>
    </Form>
  );
}

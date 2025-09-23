
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { submitApplication, type ApplicationData } from '@/app/actions';
import { Loader2 } from 'lucide-react';

const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  discordTag: z.string().min(1, 'Discord Tag is required'),
  email: z.string().email('Invalid email address'),
  steamId: z.string().min(1, 'Steam ID is required'),
  experience: z.string().min(1, 'Please describe your experience.'),
  howYouFound: z.string().min(1, 'Please let us know how you found us.'),
  terms: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export function ApplicationForm() {
  const [isTermsRead, setIsTermsRead] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: '',
      discordTag: '',
      email: '',
      steamId: '',
      experience: '',
      howYouFound: '',
      terms: false,
    },
  });

  async function onSubmit(data: ApplicationData) {
    setIsSubmitting(true);
    const result = await submitApplication(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: result.message,
      });
      form.reset();
      setIsTermsRead(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message,
      });
    }
  }

  return (
    <section id="apply" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Apply Now</h2>
          <p className="text-muted-foreground mt-2">
            Join the Tamil Pasanga VTC family.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discordTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., username#1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="steamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steam ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Steam64 ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your trucking experience (e.g., years playing, other VTCs)."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="howYouFound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did you find our VTC?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Discord, a friend, TruckersMP forums, etc."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isTermsRead || isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the terms and conditions.
                    </FormLabel>
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-primary"
                      onClick={() => setIsTermsModalOpen(true)}
                    >
                      Click here to read the terms.
                    </Button>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </div>

      <AlertDialog open={isTermsModalOpen} onOpenChange={setIsTermsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terms and Conditions</AlertDialogTitle>
            <AlertDialogDescription className="text-left max-h-[60vh] overflow-y-auto pr-2">
                <p className="mb-4">Welcome to Tamil Pasanga VTC. By submitting this application, you agree to the following terms and conditions:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>You must be at least 15 years of age to apply.</li>
                    <li>You must own a legal copy of Euro Truck Simulator 2 or American Truck Simulator on Steam.</li>
                    <li>You must have a registered TruckersMP account in good standing.</li>
                    <li>Respect all members of the community, including staff and fellow drivers. Harassment, discrimination, or any form of abuse will not be tolerated.</li>
                    <li>Follow all TruckersMP rules and regulations during convoys and on public servers.</li>
                    <li>Maintain a professional and realistic driving standard. Reckless driving is not permitted.</li>
                    <li>You are required to log a minimum number of jobs/miles per month as specified in our driver handbook to remain an active driver.</li>
                    <li>Communication is key. You must join our Discord server and be responsive to official announcements.</li>
                    <li>Dual VTCing (being a member of another VTC) is permitted, but your commitment to Tamil Pasanga must be maintained.</li>
                    <li>Failure to comply with these rules may result in disciplinary action, including suspension or removal from the VTC.</li>
                </ol>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setIsTermsRead(true);
                setIsTermsModalOpen(false);
              }}
            >
              I have read and agree
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

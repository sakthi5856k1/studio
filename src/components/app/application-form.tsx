
'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '../ui/textarea';

const applicationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  discordTag: z.string().min(1, 'Discord Tag is required'),
  email: z.string().email('Invalid email address'),
  steamUrl: z.string().url('Invalid Steam profile URL. Please enter a full URL.'),
  experience: z.enum(['fresher', 'experienced'], {
      errorMap: () => ({ message: 'Please select your experience level' }),
  }),
  howYouFound: z.enum(['truckersmp', 'friends', 'others'], {
      errorMap: () => ({ message: 'Please select an option' }),
  }),
  friendsMention: z.string().optional(),
  othersMention: z.string().optional(),
  terms: z.literal<boolean>(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
}).refine(data => {
    if (data.howYouFound === 'friends') {
        return !!data.friendsMention && data.friendsMention.trim().length > 0;
    }
    return true;
}, {
    message: 'Please mention your friend(s)',
    path: ['friendsMention'],
}).refine(data => {
    if (data.howYouFound === 'others') {
        return !!data.othersMention && data.othersMention.trim().length > 0;
    }
    return true;
}, {
    message: 'Please specify how you found us',
    path: ['othersMention'],
});


export function ApplicationForm({ onFormSubmit }: { onFormSubmit?: () => void }) {
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
      steamUrl: '',
      terms: false,
      friendsMention: '',
      othersMention: '',
    },
  });

  const howYouFoundValue = useWatch({
    control: form.control,
    name: 'howYouFound',
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
      if (onFormSubmit) {
        onFormSubmit();
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.message || 'An error occurred',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              name="steamUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steam Profile URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://steamcommunity.com/id/yourprofile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Experience</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fresher">Fresher</SelectItem>
                      <SelectItem value="experienced">Experienced</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="truckersmp">TruckersMP</SelectItem>
                      <SelectItem value="friends">Friends</SelectItem>
                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {howYouFoundValue === 'friends' && (
             <FormField
                control={form.control}
                name="friendsMention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Friend's Name(s)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please mention the friend(s) who referred you."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}

          {howYouFoundValue === 'others' && (
             <FormField
                control={form.control}
                name="othersMention"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please Specify</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Discord, TruckersMP forums, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          )}

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
    </>
  );
}

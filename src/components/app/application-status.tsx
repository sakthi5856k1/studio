
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getApplicationStatus, type StatusResult } from '@/app/actions';
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const statusSchema = z.object({
  applicationId: z.string().regex(/^TP-\d{4}$/, 'Invalid Application ID format. Example: TP-1234'),
});

type StatusFormData = z.infer<typeof statusSchema>;

const StatusDisplay = ({ status, applicationId }: { status: StatusResult['status'], applicationId: string }) => {
    let icon;
    let title;
    let description;
    let colorClass;

    switch (status) {
        case 'Pending':
            icon = <Clock className="h-12 w-12 text-yellow-500" />;
            title = 'Status: Pending';
            description = 'Your application is currently under review. Please check back later.';
            colorClass = 'border-yellow-500/50';
            break;
        case 'Accepted':
            icon = <CheckCircle className="h-12 w-12 text-green-500" />;
            title = 'Status: Accepted';
            description = 'Congratulations! Your application has been accepted. Welcome to the team!';
            colorClass = 'border-green-500/50';
            break;
        case 'Rejected':
            icon = <XCircle className="h-12 w-12 text-red-500" />;
            title = 'Status: Rejected';
            description = 'We regret to inform you that your application was not successful at this time.';
            colorClass = 'border-red-500/50';
            break;
        case 'Interview':
            icon = <AlertCircle className="h-12 w-12 text-blue-500" />;
            title = 'Status: Interview';
            description = 'Your application has advanced to the interview stage. Please check your email for details.';
            colorClass = 'border-blue-500/50';
            break;
        default:
            icon = <XCircle className="h-12 w-12 text-red-500" />;
            title = 'Not Found';
            description = 'No application found with this ID. Please double-check the ID and try again.';
            colorClass = 'border-red-500/50';
    }

    return (
        <Card className={`mt-8 text-center ${colorClass}`}>
            <CardHeader className="items-center">
                {icon}
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Application ID: {applicationId}</p>
                <p className="mt-2">{description}</p>
            </CardContent>
        </Card>
    );
};


export function ApplicationStatus() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusResult, setStatusResult] = useState<StatusResult | null>(null);

  const form = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      applicationId: '',
    },
  });

  async function onSubmit(data: StatusFormData) {
    setIsSubmitting(true);
    setStatusResult(null);
    const result = await getApplicationStatus(data.applicationId);
    setStatusResult(result);
    setIsSubmitting(false);
  }

  return (
    <div className="container mx-auto px-4 max-w-2xl">
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Check Application Status</CardTitle>
          <CardDescription>Enter your application ID to see the current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="applicationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TP-1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full rounded-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                  </>
                ) : (
                  'Check Status'
                )}
              </Button>
            </form>
          </Form>

          {statusResult && (
            <StatusDisplay status={statusResult.status} applicationId={statusResult.applicationId} />
          )}

        </CardContent>
      </Card>
    </div>
  );
}

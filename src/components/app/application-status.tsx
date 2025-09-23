
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { getApplicationStatus, type ApplicationStatusResult } from '@/app/actions';
import { Badge } from '@/components/ui/badge';

const applicationStatusSchema = z.object({
  applicationId: z.string().regex(/^TP-\d{4}$/, 'Invalid Application ID format. Example: TP-1234'),
});

type ApplicationStatusFormData = z.infer<typeof applicationStatusSchema>;

const statusInfo = {
    Accepted: {
        icon: <CheckCircle className="h-12 w-12 text-green-500" />,
        badge: <Badge variant="default" className="bg-green-500">Accepted</Badge>,
        message: 'Congratulations! Your application has been accepted.',
    },
    Pending: {
        icon: <Clock className="h-12 w-12 text-yellow-500" />,
        badge: <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>,
        message: 'Your application is currently under review. Please check back later.',
    },
    Rejected: {
        icon: <XCircle className="h-12 w-12 text-red-500" />,
        badge: <Badge variant="destructive">Rejected</Badge>,
        message: 'We regret to inform you that your application has been rejected.',
    },
    Interview: {
        icon: <AlertCircle className="h-12 w-12 text-blue-500" />,
        badge: <Badge className="bg-blue-500">Interview</Badge>,
        message: 'Your application has passed the initial screening. Please check your email for interview details.',
    },
    'Not Found': {
        icon: <AlertCircle className="h-12 w-12 text-muted-foreground" />,
        badge: <Badge variant="outline">Not Found</Badge>,
        message: 'No application found with this ID. Please double-check your Application ID.',
    },
};

export function ApplicationStatus() {
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState<ApplicationStatusResult | null>(null);

  const form = useForm<ApplicationStatusFormData>({
    resolver: zodResolver(applicationStatusSchema),
    defaultValues: {
      applicationId: '',
    },
  });

  const onSubmit = async (data: ApplicationStatusFormData) => {
    setIsLoading(true);
    setStatusResult(null);
    const result = await getApplicationStatus(data.applicationId);
    setStatusResult(result);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Check Application Status</CardTitle>
          <CardDescription>Enter your application ID to see the current status of your application.</CardDescription>
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
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check Status
              </Button>
            </form>
          </Form>

          {statusResult && (
            <div className="mt-8 text-center border-t pt-8">
              <div className="flex justify-center mb-4">{statusInfo[statusResult.status].icon}</div>
              <h3 className="text-xl font-semibold mb-2">Application ID: {statusResult.applicationId}</h3>
              <div className="mb-4 flex justify-center">{statusInfo[statusResult.status].badge}</div>
              <p className="text-muted-foreground">{statusInfo[statusResult.status].message}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

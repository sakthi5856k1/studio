"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleDiscordApplication } from '@/app/actions';
import type { ManageDiscordApplicationOutput } from '@/ai/flows/discord-application-management';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, Bot, Clipboard, ClipboardCheck, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  applicationText: z.string().min(50, "Application text must be at least 50 characters long."),
  requirements: z.string().min(20, "Requirements must be at least 20 characters long."),
});

type FormValues = z.infer<typeof formSchema>;

function CopyableContent({ title, content, icon }: { title: string; content: string; icon: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-background border-border/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-lg font-headline">{title}</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-muted-foreground">
          {copied ? <ClipboardCheck className="h-4 w-4 text-primary" /> : <Clipboard className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}


export function DiscordTool() {
  const [result, setResult] = useState<ManageDiscordApplicationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicationText: "",
      requirements: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await handleDiscordApplication(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section id="apply" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Discord Application Tool</h2>
          <p className="text-muted-foreground mt-2">Use our AI to analyze driver applications from Discord.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle>Submit Application</CardTitle>
              <CardDescription>Paste the application text and define the requirements.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="applicationText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Text</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Paste the full Discord application message here..." {...field} rows={8} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Requirements</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Must have 100+ hours in ETS2, be 18+ years old, active on Discord..." {...field} rows={4} className="bg-background"/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full rounded-full">
                    {isLoading ? <Loader2 className="animate-spin" /> : "Analyze Application"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 rounded-lg bg-background border-dashed border-2 border-border">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-lg font-semibold">AI is analyzing...</p>
                <p className="text-muted-foreground">This may take a moment.</p>
              </div>
            )}
            {result && (
              <div className="space-y-6">
                <CopyableContent title="AI Analysis" content={result.analysis} icon={<Wand2 className="text-primary"/>} />
                <CopyableContent title="Next Steps" content={result.nextSteps} icon={<ArrowRight className="text-primary"/>} />
                <CopyableContent title="Engagement Message" content={result.engagementMessage} icon={<Bot className="text-primary"/>} />
              </div>
            )}
            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 rounded-lg bg-background border-dashed border-2 border-border">
                <Wand2 className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-semibold text-muted-foreground">Analysis will appear here</p>
                <p className="text-sm text-muted-foreground/70">Submit an application to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare, Bot, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  { icon: <PenSquare size={32} />, title: "Step 1: Apply", description: "Fill out our straightforward application form.", buttonText: "Start Application", href: "#apply" },
  { icon: <Bot size={32} />, title: "Step 2: Join Discord", description: "Become a part of our community on Discord.", buttonText: "Join Discord", href: "#" },
  { icon: <Users size={32} />, title: "Step 3: Interview", description: "Have a chat with our friendly recruitment team.", buttonText: "Learn More", href: "#" },
];

export function ApplicationSteps() {
  return (
    <section id="process" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">
            How to Apply
          </h2>
          <p className="text-muted-foreground mt-2">A simple three-step process to join our team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col text-center p-6 shadow-lg border-border/50 hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
              <div className="mt-4">
                <Button asChild className="rounded-full w-full">
                  <a href={step.href}>{step.buttonText}</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

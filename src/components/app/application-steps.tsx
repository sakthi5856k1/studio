import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PenSquare, Bot, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const steps = [
  { icon: <PenSquare size={32} />, title: "Step 1: Apply", description: "Fill out our straightforward application form.", buttonText: "Start Application", href: "#", "data-apply-btn": true },
  { icon: <Bot size={32} />, title: "Step 2: Join Discord", description: "Become a part of our community on Discord.", buttonText: "Join Discord", href: "https://discord.com/invite/paRCYhJphH" },
  { icon: <Users size={32} />, title: "Step 3: Interview", description: "Have a chat with our friendly recruitment team." },
];

const ChristmasCap = () => (
  <Image
    src="https://skit.ng/wp-content/uploads/2023/12/Christmas-Hats-Skit-Store.webp"
    alt="Christmas Cap"
    width={60}
    height={60}
    className="absolute -top-6 -right-5 z-10 transform rotate-[15deg]"
  />
);

export function ApplicationSteps() {
  return (
    <section id="process" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">
            Join The Convoy
          </h2>
          <p className="text-muted-foreground mt-2">A simple three-step process to join our team.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-visible flex flex-col text-center p-6 shadow-lg border-border/50 hover:shadow-primary/20 transition-shadow duration-300">
              <ChristmasCap />
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
              {step.buttonText && step.href && (
                <div className="mt-4">
                    <Button asChild className="rounded-full w-full" {...(step['data-apply-btn'] ? { 'data-apply-btn': true } : {})}>
                    <Link href={step.href} target={step.href.startsWith('http') ? '_blank' : '_self'}>{step.buttonText}</Link>
                    </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

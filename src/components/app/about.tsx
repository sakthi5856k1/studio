import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Users, Truck, Calendar } from 'lucide-react';

const values = [
    {
      icon: <Truck size={24} className="text-primary" />,
      title: 'Professional Driving',
      description: 'Safe and realistic driving style.',
    },
    {
      icon: <ShieldCheck size={24} className="text-primary" />,
      title: 'Team Spirit',
      description: 'Helping each other and staying united as a family.',
    },
    {
        icon: <Users size={24} className="text-primary" />,
        title: 'Community Vibes',
        description: 'Open to all, but proud to represent Tamil culture worldwide.',
    },
    {
        icon: <Calendar size={24} className="text-primary" />,
        title: 'Convoys & Events',
        description: 'Regular convoys, both public and private, ensuring everyone enjoys the journey.',
    },
];

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline relative pb-2">
              Who We Are
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-primary"></span>
            </h2>
            <p className="text-muted-foreground">
              Tamil Pasanga VTC is a community-driven Virtual Trucking Company created by Tamil players who share the same passion for trucks, simulation, and brotherhood. We proudly carry the Tamil identity into the world of TruckersMP, building not just a VTC but a family where teamwork, fun, and respect always come first.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-headline relative pb-2">
              Our Mission
              <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-primary"></span>
            </h2>
            <p className="text-muted-foreground">
              Our mission is to unite Tamil truckers and friends from around the globe under one banner, giving them a space to enjoy realistic trucking, participate in convoys, and make memories together. We aim to create an environment that is professional yet relaxed, where both beginners and experienced drivers can feel welcome.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="bg-background border-border/50 shadow-lg p-6 flex items-start gap-4 hover:shadow-primary/20 transition-shadow duration-300">
                <div className="shrink-0">
                    {value.icon}
                </div>
                <div className="space-y-1">
                    <h3 className="font-semibold">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

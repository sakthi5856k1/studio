import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Blocks, FileText, Store, Truck, Gamepad2, Users } from 'lucide-react';

const features = [
  { icon: <Blocks size={32} />, title: "Division", description: "Structured divisions for various logistic operations." },
  { icon: <FileText size={32} />, title: "Contracts", description: "Take on diverse contracts and grow your career." },
  { icon: <Store size={32} />, title: "Marketplace", description: "A vibrant marketplace for all your logistical needs." },
  { icon: <Truck size={32} />, title: "Tours", description: "Participate in organized tours and special events." },
  { icon: <Gamepad2 size={32} />, title: "Garage HQ", description: "Manage your fleet from your personal headquarters." },
  { icon: <Users size={32} />, title: "Community", description: "Join a thriving community of drivers and enthusiasts." },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Our Features</h2>
          <p className="text-muted-foreground mt-2">Everything you need for a premier logistics experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border/50 text-center p-6 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

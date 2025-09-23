import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, HeartHandshake, Globe, CalendarDays } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const values = [
  {
    icon: <Truck className="h-6 w-6 text-primary" />,
    title: 'Professional Driving',
    description: 'Safe and realistic driving style.',
  },
  {
    icon: <HeartHandshake className="h-6 w-6 text-primary" />,
    title: 'Team Spirit',
    description: 'Helping each other and staying united as a family.',
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    title: 'Community Vibes',
    description: 'Open to all, but proud to represent Tamil culture worldwide.',
  },
  {
    icon: <CalendarDays className="h-6 w-6 text-primary" />,
    title: 'Convoys & Events',
    description:
      'Regular convoys, both public and private, ensuring everyone enjoys the journey.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-card border-border/50 shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-3xl font-headline text-white">Who We Are</CardTitle>
                <Separator className="my-2 bg-primary w-1/4" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tamil Pasanga VTC is a community-driven Virtual Trucking Company created by
                  Tamil players who share the same passion for trucks, simulation, and brotherhood.
                  We proudly carry the Tamil identity into the world of TruckersMP, building not just
                  a VTC but a family where teamwork, fun, and respect always come first.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50 shadow-lg p-6">
              <CardHeader>
                <CardTitle className="text-3xl font-headline text-white">Our Mission</CardTitle>
                <Separator className="my-2 bg-primary w-1/4" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our mission is to unite Tamil truckers and friends from around the globe under
                  one banner, giving them a space to enjoy realistic trucking, participate in convoys,
                  and make memories together. We aim to create an environment that is
                  professional yet relaxed, where both beginners and experienced drivers can feel
                  welcome.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            {values.map((value) => (
              <Card key={value.title} className="bg-card border-border/50 shadow-lg p-6 flex items-start gap-4">
                <div className="flex-shrink-0">{value.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{value.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{value.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

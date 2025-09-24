import { Card, CardContent } from '@/components/ui/card';
import { Truck, Handshake, Shield, Flag, Calendar } from 'lucide-react';
import Image from 'next/image';

const values = [
    {
      icon: <Truck size={32} className="text-primary" />,
      title: 'Regular Convoys',
      description: 'Weekly/monthly convoys across Europe & ProMods.',
    },
    {
      icon: <Handshake size={32} className="text-primary" />,
      title: 'Friendly Community',
      description: 'A family-like atmosphere, always ready to help.',
    },
    {
      icon: <Shield size={32} className="text-primary" />,
      title: 'Professional Standards',
      description: 'Realistic rules, safe convoys, and clean driving.',
    },
    {
      icon: <Flag size={32} className="text-primary" />,
      title: 'Cultural Unity',
      description: 'Representing Tamil pride and values globally.',
    },
    {
      icon: <Calendar size={32} className="text-primary" />,
      title: 'Events & Partnerships',
      description: 'Join international VTC events and collaborations.',
    },
];

export function CoreValues() {
  return (
    <section id="core-values" className="relative py-16 md:py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.discordapp.com/attachments/1281551151418048677/1417739857123475538/1758085736934.jpg?ex=68d37da2&is=68d22c22&hm=8704f60b91d953c3e9b83e28d406e362c20affcf91876b7d903227bb10d8bb9d&=&format=webp&width=1389&height=684"
          alt="Tamil Pasanga Truck"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {values.slice(0, 3).map((value, index) => (
               <Card key={index} className="bg-card/80 backdrop-blur-sm text-center p-6 shadow-lg border-border/50 hover:shadow-primary/20 transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        {value.icon}
                        <h3 className="text-xl font-headline text-primary">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-8 justify-center lg:max-w-4xl lg:mx-auto">
            {values.slice(3, 5).map((value, index) => (
                <Card key={index} className="bg-card/80 backdrop-blur-sm text-center p-6 shadow-lg border-border/50 hover:shadow-primary/20 transition-shadow duration-300">
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        {value.icon}
                        <h3 className="text-xl font-headline text-primary">{value.title}</h3>
                        <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  );
}

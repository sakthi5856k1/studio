import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Users, Bot, CalendarCheck } from 'lucide-react';

const achievements = [
  { icon: <Users size={40} />, value: "150+", label: "Active Drivers" },
  { icon: <Bot size={40} />, value: "500+", label: "Discord Members" },
  { icon: <CalendarCheck size={40} />, value: "50+", label: "Events Attended" },
];

export function Achievements() {
  return (
    <section id="achievements" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">
            Our Achievements
          </h2>
          <p className="text-muted-foreground mt-2">Numbers that speak for themselves.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {achievements.map((item, index) => (
            <Card key={index} className="p-8 text-center bg-card border-border/50">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="text-primary">{item.icon}</div>
                <p className="text-5xl font-bold font-headline text-primary">{item.value}</p>
                <CardTitle className="text-xl font-medium text-white">{item.label}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

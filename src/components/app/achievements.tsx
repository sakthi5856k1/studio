import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Users, CalendarCheck } from 'lucide-react';

const achievements = [
  { icon: <Users size={40} />, value: "50+", label: "Active Drivers" },
  { icon: <CalendarCheck size={40} />, value: "100+", label: "Events Completed" },
];

export function Achievements() {
  return (
    <section id="achievements" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold">OUR ACHIEVEMENTS</span>
          <h2 className="text-3xl md:text-4xl font-headline mt-2">
            Community Statistics
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {achievements.map((item, index) => (
            <Card key={index} className="p-8 text-center bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="text-primary w-24 h-24 rounded-full bg-background/50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
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

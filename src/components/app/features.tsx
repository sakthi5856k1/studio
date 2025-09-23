"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Blocks, FileText, Store, Truck, Gamepad2, Users, ClipboardCheck, HeartHandshake, Trophy, LayoutDashboard, Award, Palette, Map, Milestone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: <Blocks size={32} />, title: "Division", description: "Structured divisions for various logistic operations." },
  { icon: <FileText size={32} />, title: "Contracts", description: "Take on diverse contracts and grow your career." },
  { icon: <Store size={32} />, title: "Marketplace", description: "A vibrant marketplace for all your logistical needs." },
  { icon: <Truck size={32} />, title: "Tours", description: "Participate in organized tours and special events." },
  { icon: <Gamepad2 size={32} />, title: "Garage HQ", description: "Manage your fleet from your personal headquarters." },
  { icon: <Users size={32} />, title: "Community", description: "Join a thriving community of drivers and enthusiasts." },
  { icon: <ClipboardCheck size={32} />, title: "Examination System", description: "Test and improve your driving skills with comprehensive examinations and practical assessments." },
  { icon: <HeartHandshake size={32} />, title: "Dedicated Staff", description: "Receive outstanding support and guidance from our experienced and friendly team." },
  { icon: <Trophy size={32} />, title: "Ranking System", description: "Rise through the leaderboards and earn recognition in our competitive ranking system." },
  { icon: <LayoutDashboard size={32} />, title: "Drivershub", description: "Access all essential tools, resources, and updates in one seamless, centralized hub." },
  { icon: <Award size={32} />, title: "Ranks", description: "Achieve prestigious ranks and badges by demonstrating dedication and exceptional performance." },
  { icon: <Palette size={32} />, title: "Custom UI, Cargo & Skins", description: "Express yourself by personalizing your interface, cargo, and vehicle skins with endless options." },
  { icon: <Map size={32} />, title: "Live Map", description: "Track your location and progress in real time with our interactive live map feature." },
  { icon: <Users size={32} />, title: "Discord Community", description: "Connect with fellow drivers, share experiences, and participate in events within our thriving Discord community." },
  { icon: <Milestone size={32} />, title: "Celestial Milestone Tracker", description: "Our drivers and pilots have journeyed incredible distances, pushing boundaries and breaking limits." },
];

const INITIAL_VISIBLE_FEATURES = 6;

export function Features() {
  const [showAll, setShowAll] = useState(false);

  const visibleFeatures = showAll ? features : features.slice(0, INITIAL_VISIBLE_FEATURES);

  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline">Our Features</h2>
          <p className="text-muted-foreground mt-2">Everything you need for a premier logistics experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleFeatures.map((feature, index) => (
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
        {!showAll && features.length > INITIAL_VISIBLE_FEATURES && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={() => setShowAll(true)}>
              View All Features
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

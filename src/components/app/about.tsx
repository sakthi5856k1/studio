import { Card, CardContent } from '@/components/ui/card';
import { Truck, Users, ShieldCheck, Calendar } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

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
  const aboutImage = PlaceHolderImages.find(img => img.id === 'about-truck');

  return (
    <>
      <section id="about" className="py-16 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold">ABOUT US</span>
            <h1 className="text-4xl md:text-5xl font-headline mt-2">Tamil Pasanga Virtual Trucking Company</h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3 space-y-4 text-muted-foreground">
              <p>
                Tamil Pasanga Is Virtual Trucking Company based around Euro Truck Simulator 2 and American Truck Simulator. It was Founded On 13 Aug 2024 To Bring People Together. It Was Founded By Powerful Gaming.
              </p>
              <p>
                Welcome to the Tamil Pasanga Virtual Trucking Community, where the open road meets endless opportunity! Immerse yourself in a world where innovation and camaraderie fuel the miles you'll conquer. Designed for trucking enthusiasts of all levels, our community provides an immersive experience that redefines virtual logistics—as you roll through breathtaking routes and engage in dynamic missions that transport you into the driver's seat.
              </p>
              <p>
                Our community celebrates the spirit of trucking through a vibrant online platform, connecting players around the globe. Whether you're a seasoned veteran of the simulation or a newcomer eager to explore, Tamil Pasanga is your haven for sharing knowledge, logistics tips, and unforgettable trucking adventures. With a robust support system in place, members can tap into rich resources—from realistic trucking strategies to tech tutorials—ensuring everyone hits the road at their best.
              </p>
               <p>
                At Tamil Pasanga, we believe that every mile matters. Our regularly hosted events, convoy drives, and competitive challenges bring excitement and friendly rivalry to your experience, making your virtual journeys not just everyday missions, but memorable escapades. As part of our community, you'll join a family that thrives on the joy of the journey, celebrating milestones and achievements together.
              </p>
              <p>
                Safety and respect are at the forefront of our ethos, fostering a welcoming environment for all members to enjoy their virtual trucking experience.
              </p>
            </div>
            <div className="lg:col-span-2">
              {aboutImage && (
                <Image 
                  src={aboutImage.imageUrl} 
                  alt={aboutImage.description}
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg mx-auto"
                  data-ai-hint={aboutImage.imageHint}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="relative py-16 md:py-24 bg-card">
         <div className="absolute inset-0 z-0">
            <Image
            src="https://cdn.discordapp.com/attachments/1281551151418048677/1417739857123475538/1758085736934.jpg?ex=68d37da2&is=68d22c22&hm=8704f60b91d953c3e9b83e28d406e362c20affcf91876b7d903227bb10d8bb9d&=&format=webp&width=1389&height=684"
            alt="Background trucks"
            fill
            className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/50" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center mb-12">
            <span className="text-primary font-semibold">OUR VALUES</span>
            <h2 className="text-3xl md:text-4xl font-headline mt-2">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-transparent border-0 text-center p-6 flex flex-col items-center gap-4">
                  <div className="shrink-0 w-24 h-24 rounded-full border-2 border-primary/50 flex items-center justify-center bg-background/50 mb-4">
                      {value.icon}
                  </div>
                  <div className="space-y-1">
                      <h3 className="font-semibold text-xl">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

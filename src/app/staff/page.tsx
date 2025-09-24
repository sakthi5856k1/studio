
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import staffData from '@/lib/staff-members.json';
import type { StaffMember } from '@/lib/staff-members';
import { Truck } from 'lucide-react';

const staffMembers: StaffMember[] = staffData.staffMembers;

// Group staff by role
const staffByRole = staffMembers.reduce((acc, member) => {
  if (!acc[member.role]) {
    acc[member.role] = [];
  }
  acc[member.role].push(member);
  return acc;
}, {} as Record<string, StaffMember[]>);

// Define the order of roles
const roleOrder = [
    'Managing Director',
    'Marketing Executive',
    'Human Resource Staff',
    'Trainer',
    'Event Staff',
    'Event Organizer',
    'Media Staff',
    'Media Editor',
    'Senior Driver',
    'Driver',
    'Trainee',
];

const bannerImageUrl = "https://cdn.discordapp.com/attachments/1281551151418048677/1414862372199202927/ets2_20250907_201945_00.PNG?ex=68d43a84&is=68d2e904&hm=c6a185bd254316fdb29cdd8e8f8255b85a60a3760da66ed8f10813dc2d90e01b&";

const SteamIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12,2A10,10,0,0,0,2,12A10,10,0,0,0,12,22A10,10,0,0,0,22,12A10,10,0,0,0,12,2M12,4A8,8,0,0,1,20,12A8,8,0,0,1,12,20A8,8,0,0,1,4,12A8,8,0,0,1,12,4M8.15,8.15C7.86,7.86 7.3,8.08 7.35,8.5L8.23,13.2L3.5,14.65C3.08,14.8 2.86,15.36 3.15,15.65L8.5,18.85L13.2,17.96L14.65,22.5C14.8,22.92 15.36,23.14 15.65,22.85L18.85,17.5L17.96,12.8L22.5,11.35C22.92,11.2 23.14,10.64 22.85,10.35L17.5,7.15L12.8,8.04L11.35,3.5C11.2,3.08 10.64,2.86 10.35,3.15L7.15,8.15M13,9A4,4,0,0,1,17,13A4,4,0,0,1,13,17A4,4,0,0,1,9,13A4,4,0,0,1,13,9M13,11A2,2,0,0,0,11,13A2,2,0,0,0,13,15A2,2,0,0,0,15,13A2,2,0,0,0,13,11Z" />
    </svg>
);


export default function StaffPage() {
  const defaultImage = PlaceHolderImages.find(img => img.id === 'testimonial-avatar');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="relative h-64 w-full overflow-hidden">
            <Image
                src={bannerImageUrl}
                alt="Staff Banner"
                fill
                className="object-cover animate-fade-in"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-headline text-white animate-slide-up-fade">Our Staff</h1>
                    <p className="text-muted-foreground mt-2 text-white/80 animate-slide-up-fade [animation-delay:0.3s]">The team that makes it all happen.</p>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          {roleOrder.map((role) => {
            const membersInRole = staffByRole[role];
            if (!membersInRole || membersInRole.length === 0) return null;

            return (
              <div key={role} className="mb-12">
                <h2 className="text-2xl font-headline text-primary mb-6 animate-fade-in-scroll">{role}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {membersInRole.map((member) => {
                    const imageSrc = member.imageUrl || defaultImage?.imageUrl;
                    return (
                      <Card key={member.id} className="text-center bg-card border-border/50 shadow-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 group">
                        <CardHeader>
                            {imageSrc && (
                                <Image
                                    src={imageSrc}
                                    alt={`Photo of ${member.name}`}
                                    width={80}
                                    height={80}
                                    className="rounded-full mx-auto border-4 border-primary/50"
                                />
                            )}
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-lg font-semibold">{member.name}</CardTitle>
                            <p className="text-sm text-pink-400">{member.role}</p>
                            <div className="flex justify-center gap-4 mt-4">
                                {member.steamUrl && (
                                    <Link href={member.steamUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <SteamIcon className="h-5 w-5" />
                                    </Link>
                                )}
                                {member.truckersmpUrl && (
                                    <Link href={member.truckersmpUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                        <Truck size={20} />
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="mt-12 text-center">
              <Button variant="outline" asChild className="hover:shadow-lg hover:shadow-primary/40 transition-shadow">
                  <Link href="/">Back to Home</Link>
              </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

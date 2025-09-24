
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import staffData from '@/lib/staff-members.json';
import type { StaffMember } from '@/lib/staff-members';

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

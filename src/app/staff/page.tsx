
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
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
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <div className="relative h-64 w-full">
            <Image
                src={bannerImageUrl}
                alt="Staff Banner"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-headline text-white">Our Staff</h1>
                    <p className="text-muted-foreground mt-2 text-white/80">The team that makes it all happen.</p>
                </div>
            </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          {roleOrder.map((role) => {
            const membersInRole = staffByRole[role];
            if (!membersInRole || membersInRole.length === 0) return null;

            return (
              <div key={role} className="mb-12">
                <h2 className="text-2xl font-headline text-primary mb-6">{role}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {membersInRole.map((member) => {
                    const image = PlaceHolderImages.find(img => img.id === member.imageId);
                    return (
                      <Card key={member.id} className="bg-card border-border/50 shadow-sm hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                        <CardContent className="p-4 flex items-center gap-4">
                          {image && (
                            <Image
                              src={image.imageUrl}
                              alt={`Photo of ${member.name}`}
                              width={48}
                              height={48}
                              className="rounded-full border-2 border-primary/50 shrink-0"
                              data-ai-hint={image.imageHint}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{member.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{member.role}</p>
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
              <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
              </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

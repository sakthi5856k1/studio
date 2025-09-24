
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import staffData from '@/lib/staff-members.json';
import type { StaffMember } from '@/lib/staff-members';
import { Truck, Shield, Star, School, Film, Calendar, BookOpen, Users, Briefcase, Trophy, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

const ChristmasCap = () => (
  <Image
    src="https://media.discordapp.net/attachments/1116720480544636999/1274425873201631304/TP_NEW_WB_PNGxxxhdpi.png?ex=68d4d8d5&is=68d38755&hm=b6d4e0e4ef2c3215a4de4fb2f592189a60ddd94c651f96fe04deac2e7f96ddc6&=&format=webp&quality=lossless&width=826&height=826"
    alt="Christmas Cap"
    width={60}
    height={60}
    className="absolute -top-6 -right-5 z-10 transform rotate-[15deg]"
  />
);


export default function StaffPage() {
  const defaultImage = PlaceHolderImages.find(img => img.id === 'testimonial-avatar');

  const teamMembersCount = staffMembers.length;
  const rolesCount = roleOrder.length;
  
  const leadership = staffMembers.filter(m => m.role === 'Managing Director');
  const otherStaff = staffMembers.filter(m => m.role !== 'Managing Director');

  // Re-calculate staff by role for non-leadership roles
  const staffByRoleFiltered = otherStaff.reduce((acc, member) => {
    if (!acc[member.role]) {
      acc[member.role] = [];
    }
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, StaffMember[]>);


  const stats = [
    { icon: <Users size={24} className="text-yellow-400" />, value: teamMembersCount, label: "Team Members" },
    { icon: <Trophy size={24} className="text-yellow-400" />, value: rolesCount, label: "Roles" },
    { icon: <Star size={24} className="text-yellow-400" />, value: "24/7", label: "Support" },
    { icon: <Truck size={24} className="text-yellow-400" />, value: "100%", label: "Professional" },
  ];

  const getRoleStyle = (role: string) => {
    if (role === 'Managing Director') return 'border-yellow-400/50 bg-yellow-950/50 text-yellow-300';
    if (role === 'Senior Driver') return 'border-yellow-500/50 bg-yellow-950/50 text-yellow-400';
    if (role === 'Driver') return 'border-green-500/50 bg-green-950/50 text-green-400';
    if (role === 'Trainee') return 'border-red-500/50 bg-red-950/50 text-red-400';
    if (role === 'Media Staff' || role === 'Media Editor') return 'border-purple-500/50 bg-purple-950/50 text-purple-400';
    if (role === 'Event Staff' || role === 'Event Organizer') return 'border-orange-500/50 bg-orange-950/50 text-orange-400';
    if (role === 'Trainer') return 'border-cyan-500/50 bg-cyan-950/50 text-cyan-400';
    if (role === 'Human Resource Staff') return 'border-pink-500/50 bg-pink-950/50 text-pink-400';
    if (role === 'Marketing Executive') return 'border-teal-500/50 bg-teal-950/50 text-teal-400';
    return 'border-blue-500/50 bg-blue-950/50 text-blue-400';
  };

  const getRoleIcon = (role: string) => {
    if (role === 'Managing Director') return <Crown className="mr-1 h-3 w-3 text-yellow-300" />;
    if (role === 'Senior Driver') return <Star className="mr-1 h-3 w-3 text-yellow-400" />;
    if (role === 'Driver') return <Truck className="mr-1 h-3 w-3 text-green-400" />;
    if (role === 'Trainee') return <School className="mr-1 h-3 w-3 text-red-400" />;
    if (role === 'Media Staff' || role === 'Media Editor') return <Film className="mr-1 h-3 w-3 text-purple-400" />;
    if (role === 'Event Staff' || role === 'Event Organizer') return <Calendar className="mr-1 h-3 w-3 text-orange-400" />;
    if (role === 'Trainer') return <BookOpen className="mr-1 h-3 w-3 text-cyan-400" />;
    if (role === 'Human Resource Staff') return <Users className="mr-1 h-3 w-3 text-pink-400" />;
    if (role === 'Marketing Executive') return <Briefcase className="mr-1 h-3 w-3 text-teal-400" />;
    return <Shield className="mr-1 h-3 w-3 text-blue-400" />;
  };

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

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="relative overflow-visible bg-card/80 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/20">
                  <ChristmasCap />
                  <div className="flex justify-center mb-4">
                    {stat.icon}
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          
        {leadership.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center justify-center gap-4 mb-8">
                  <h2 className="text-3xl font-headline text-primary animate-fade-in-scroll">
                      Leadership
                  </h2>
              </div>
              <div className="flex justify-center">
                {leadership.map((member) => {
                  const imageSrc = member.imageUrl || defaultImage?.imageUrl;
                  return (
                    <Card key={member.id} className="relative overflow-visible animated-border text-center bg-transparent shadow-lg transition-all duration-300 w-full max-w-sm p-[2px]">
                      <ChristmasCap />
                      <CardContent className="flex flex-col items-center justify-center pt-6">
                          {imageSrc && (
                              <Image
                                  src={imageSrc}
                                  alt={`Photo of ${member.name}`}
                                  width={120}
                                  height={120}
                                  className="rounded-full mx-auto border-4 border-green-500"
                              />
                          )}
                          <CardTitle className="text-xl font-semibold mt-4">{member.name}</CardTitle>
                           <Badge 
                              variant="outline" 
                              className={`mt-2 ${getRoleStyle(member.role)}`}
                          >
                              {getRoleIcon(member.role)}
                              {member.role}
                          </Badge>
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
          )}

          {roleOrder.map((role) => {
            if (role === 'Managing Director') return null; // Already rendered
            const membersInRole = staffByRoleFiltered[role];
            if (!membersInRole || membersInRole.length === 0) return null;

            return (
              <div key={role} className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-headline text-primary animate-fade-in-scroll">
                        {role}
                    </h2>
                    <div className="bg-red-600 text-white text-sm font-semibold rounded-full px-3 py-1 animate-fade-in-scroll">
                        {membersInRole.length} {membersInRole.length === 1 ? 'member' : 'members'}
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {membersInRole.map((member) => {
                    const imageSrc = member.imageUrl || defaultImage?.imageUrl;
                    return (
                      <Card key={member.id} className="relative overflow-visible animated-border text-center bg-transparent shadow-sm transition-all duration-300 hover:scale-105 group p-[2px]">
                        <ChristmasCap />
                        <CardHeader className="flex flex-col items-center">
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
                        <CardContent className="flex flex-col items-center justify-center">
                            <CardTitle className="text-lg font-semibold">{member.name}</CardTitle>
                             <Badge 
                                variant="outline" 
                                className={`mt-2 ${getRoleStyle(member.role)}`}
                            >
                                {getRoleIcon(member.role)}
                                {member.role}
                            </Badge>
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

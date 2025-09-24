
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const staffByCategory = [
    {
        category: 'Our Team',
        teams: [
            {
                teamName: 'Managing Director',
                members: [{ name: 'POWERFUL GAMING', role: 'Managing Director', imageId: 'testimonial-avatar' }],
            },
            {
                teamName: 'Marketing Executive',
                members: [{ name: 'Kishorkishor GI', role: 'Marketing Executive', imageId: 'testimonial-avatar' }],
            },
            {
                teamName: 'Human Resource Staff',
                members: [
                    { name: 'GAMING WITH HRIVAL (HR)', role: 'Human Resource Staff', imageId: 'testimonial-avatar' },
                    { name: 'SAARTHI GAMER YT', role: 'Human Resource Staff', imageId: 'testimonial-avatar' },
                ],
            },
            {
                teamName: 'Trainer',
                members: [{ name: 'SCONT NUT', role: 'Trainer', imageId: 'testimonial-avatar' }],
            },
            {
                teamName: 'Event Staff',
                members: [
                    { name: 'Spartan Gaming YT Tamil', role: 'Event Staff', imageId: 'testimonial-avatar' },
                    { name: 'venkatesh(TP-EMTMT)', role: 'Event Staff', imageId: 'testimonial-avatar' },
                ],
            },
            {
                teamName: 'Event Organizer',
                members: [{ name: 'Ajith M', role: 'Event Organizer', imageId: 'testimonial-avatar' }],
            },
            {
                teamName: 'Media Staff',
                members: [{ name: 'KISHORE GAMING', role: 'Media Staff', imageId: 'testimonial-avatar' }],
            },
            {
                teamName: 'Media Editor',
                members: [{ name: 'ganeshPrasanna', role: 'Media Editor', imageId: 'testimonial-avatar' }],
            },
            {
                teamName: 'Senior Driver',
                members: [
                    { name: 'chian6666', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                    { name: 'PCBGAMING', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                    { name: 'King of My Queen', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                    { name: 'ramzypranad', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                    { name: 'SHAMEER_KIRIS', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                    { name: 'sinshas', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                    { name: 'E-Quaran', role: 'Senior Driver', imageId: 'testimonial-avatar' },
                ],
            },
            {
                teamName: 'Driver',
                members: [
                    { name: 'Ajo-02003', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Amrish0018', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'ATLA_S', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Dineshkumars', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'ToMMy2xd', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Franklin_01', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'HarryGaming', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'I_am_Devil', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Krsna', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'its me siva', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'JACK RALDY YT', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'newoneofficialyt', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'karthi007', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'king Rocky', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Mogash', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'MragullOP', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'ravibuhin', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'nevillebajan', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Nothing_278H', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'NOCENT S.A.M', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'ROCKYBALBOA121', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'ramsu_shere', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Xian Dande [TP-HR]', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'uzumavle', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'SHARUNRAVI', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'chicken Gaming yt', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'riNavI', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'STARKMWM', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'steban gaming YT', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'rithwi', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Sivasurya00', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'subin00', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'rangithevan', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Tamil Pasanga VTC', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'TheBlakrown', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Hari SK [TP HR]', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Vishalraja017', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'Vivank_001', role: 'Driver', imageId: 'testimonial-avatar' },
                    { name: 'vshark.gayu', role: 'Driver', imageId: 'testimonial-avatar' },
                ],
            },
            {
                teamName: 'Trainee',
                members: [
                    { name: 'G V GAMING', role: 'Trainee', imageId: 'testimonial-avatar' },
                    { name: 'Pasindu05X', role: 'Trainee', imageId: 'testimonial-avatar' },
                    { name: 'Premkumar', role: 'Trainee', imageId: 'testimonial-avatar' },
                    { name: 'sure yadav', role: 'Trainee', imageId: 'testimonial-avatar' },
                ],
            },
        ],
    },
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
          {staffByCategory.map((category) => (
            <div key={category.category}>
              {category.teams.map((team) => (
                <div key={team.teamName} className="mb-12">
                  <h2 className="text-2xl font-headline text-primary mb-6">{team.teamName}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {team.members.map((member) => {
                      const image = PlaceHolderImages.find(img => img.id === member.imageId);
                      return (
                        <Card key={member.name} className="text-center bg-card border-border/50 shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                          <CardHeader className="items-center pt-6">
                            {image && (
                              <Image
                                src={image.imageUrl}
                                alt={`Photo of ${member.name}`}
                                width={80}
                                height={80}
                                className="rounded-full border-4 border-primary"
                                data-ai-hint={image.imageHint}
                              />
                            )}
                          </CardHeader>
                          <CardContent className="pb-6">
                            <CardTitle className="font-headline text-lg mt-4">{member.name}</CardTitle>
                            <p className="text-muted-foreground">{member.role}</p>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
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

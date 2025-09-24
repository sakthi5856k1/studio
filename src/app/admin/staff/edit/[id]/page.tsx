
import { getStaffMember } from './actions';
import { EditStaffForm } from './edit-staff-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/app/footer';
import { notFound } from 'next/navigation';

export default async function EditStaffPage({ params }: { params: { id: string } }) {
  const member = await getStaffMember(params.id);

  if (!member) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Staff Member Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditStaffForm member={member} />
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

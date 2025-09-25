
import { getEvent } from './actions';
import { EditEventForm } from './edit-event-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/app/footer';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditEventForm event={event} />
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

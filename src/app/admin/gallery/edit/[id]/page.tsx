
import { getGalleryImage } from './actions';
import { EditImageForm } from './edit-image-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/app/footer';
import { notFound } from 'next/navigation';

export default async function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const image = await getGalleryImage(params.id);

  if (!image) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Image Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <EditImageForm image={image} />
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

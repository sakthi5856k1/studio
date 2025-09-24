import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateNewsForm } from "./create-news-form";
import { Footer } from "@/components/app/footer";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function CreateNewsPage() {
    const bannerImage = PlaceHolderImages.find(img => img.id === 'create-news-banner');

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow">
                <div className="relative h-64 w-full">
                    {bannerImage && (
                         <Image
                            src={bannerImage.imageUrl}
                            alt={bannerImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={bannerImage.imageHint}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <h1 className="text-4xl font-headline text-white">Create a New Article</h1>
                    </div>
                </div>
                <div className="max-w-2xl mx-auto p-4 md:p-8 -mt-16">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateNewsForm />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

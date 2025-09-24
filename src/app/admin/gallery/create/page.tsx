
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateImageForm } from "./create-image-form";
import { Footer } from "@/components/app/footer";

export default function CreateGalleryImagePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Gallery Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateImageForm />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

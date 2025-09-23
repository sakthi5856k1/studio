import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateNewsForm } from "./create-news-form";
import { Footer } from "@/components/app/footer";

export default function CreateNewsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Article</CardTitle>
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

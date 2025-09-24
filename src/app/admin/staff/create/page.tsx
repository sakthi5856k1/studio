
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateStaffForm } from "./create-staff-form";
import { Footer } from "@/components/app/footer";

export default function CreateStaffPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="max-w-2xl w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Staff Member</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateStaffForm />
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}

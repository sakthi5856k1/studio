
import { Footer } from "@/components/app/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Application, ApplicationsData } from "@/lib/applications";
import { CheckCircle, Clock, FileText, MoreHorizontal, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import fs from 'fs/promises';
import path from 'path';
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { UpdateApplicationStatus } from "./actions";

async function getApplications(): Promise<Application[]> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        const jsonData: ApplicationsData = JSON.parse(data);
        // Sort by submission date, newest first
        return jsonData.applications.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            return [];
        }
        console.error("Failed to read applications:", error);
        return [];
    }
}

const statusInfo = {
    Accepted: { icon: <CheckCircle className="h-4 w-4 text-green-500" />, badge: <Badge variant="default" className="bg-green-500">Accepted</Badge> },
    Pending: { icon: <Clock className="h-4 w-4 text-yellow-500" />, badge: <Badge variant="secondary" className="bg-yellow-500">Pending</Badge> },
    Rejected: { icon: <XCircle className="h-4 w-4 text-red-500" />, badge: <Badge variant="destructive">Rejected</Badge> },
    Interview: { icon: <AlertCircle className="h-4 w-4 text-blue-500" />, badge: <Badge className="bg-blue-500">Interview</Badge> },
};

export default async function ApplicationsAdminPage() {
    const applications = await getApplications();

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-headline flex items-center gap-2">
                            <FileText />
                            Manage Applications
                        </h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Applications</CardTitle>
                            <CardDescription>
                                {applications.length} application(s) found.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Discord Tag</TableHead>
                                        <TableHead>Submitted At</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.map((app) => (
                                        <TableRow key={app.id}>
                                            <TableCell className="font-medium">{app.id}</TableCell>
                                            <TableCell>{app.name}</TableCell>
                                            <TableCell>{app.discordTag}</TableCell>
                                            <TableCell>{format(new Date(app.submittedAt), 'PPp')}</TableCell>
                                            <TableCell>{statusInfo[app.status]?.badge || app.status}</TableCell>
                                            <TableCell className="text-right">
                                                 <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <UpdateApplicationStatus applicationId={app.id} status="Accepted" />
                                                        <UpdateApplicationStatus applicationId={app.id} status="Rejected" />
                                                        <UpdateApplicationStatus applicationId={app.id} status="Interview" />
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                     <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/admin">Back to Admin</Link>
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

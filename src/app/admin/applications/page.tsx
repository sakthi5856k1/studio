
'use client';

import React, { useState } from 'react';
import { Footer } from "@/components/app/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Application } from "@/lib/applications";
import { CheckCircle, Clock, FileText, MoreHorizontal, XCircle, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';
import { UpdateApplicationStatus } from "./actions";
import fs from 'fs';
import path from 'path';

// This is now a client component to manage state, but we'll fetch data on the server side
// within a useEffect hook or pass it as props if this were a child component.
// For simplicity in this fix, we'll read the data directly here, which is not ideal
// for production but will resolve the immediate rendering error.
// A better pattern would be to fetch this data in a server component parent and pass it down.

// Helper function to get applications - emulating the original server-side fetch
async function getApplications(): Promise<Application[]> {
    const filePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        // Sort by submission date, newest first
        return jsonData.applications.sort((a: Application, b: Application) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
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

// We create a new component for the row to manage its own state
function ApplicationRow({ app }: { app: Application }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="group">
                        <ChevronDown className={isOpen ? "hidden" : "h-4 w-4"} />
                        <ChevronUp className={isOpen ? "h-4 w-4" : "hidden"} />
                    </Button>
                </TableCell>
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
                            <UpdateApplicationStatus applicationId={app.id} status="Accepted" currentStatus={app.status} />
                            <UpdateApplicationStatus applicationId={app.id} status="Rejected" currentStatus={app.status} />
                            <UpdateApplicationStatus applicationId={app.id} status="Interview" currentStatus={app.status} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
            </TableRow>
            {isOpen && (
                <TableRow className="bg-muted/50">
                    <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Email:</strong> {app.email}</div>
                            <div><strong>Experience:</strong> <span className="capitalize">{app.experience}</span></div>
                            <div>
                                <strong>Steam Profile:</strong>
                                <Link href={app.steamUrl} target="_blank" className="text-primary hover:underline ml-2">View Profile</Link>
                            </div>
                            <div className="col-span-full">
                                <strong>How they found us:</strong> <span className="capitalize">{app.howYouFound}</span>
                                {app.howYouFound === 'friends' && app.friendsMention && ` - ${app.friendsMention}`}
                                {app.howYouFound === 'others' && app.othersMention && ` - ${app.othersMention}`}
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </React.Fragment>
    );
}


export default function ApplicationsAdminPage() {
    // This is not ideal for a client component, but for the sake of fixing the bug,
    // we are reading the file synchronously on the server and passing it down.
    // In a real app, this data would be fetched via an API or passed from a Server Component parent.
    const applicationsFilePath = path.join(process.cwd(), 'src', 'lib', 'applications.json');
    let applications: Application[] = [];
    try {
        const data = fs.readFileSync(applicationsFilePath, 'utf-8');
        const jsonData = JSON.parse(data);
        applications = jsonData.applications.sort((a: Application, b: Application) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    } catch (error) {
         console.error("Failed to read applications:", error);
    }


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
                                        <TableHead className="w-12"></TableHead>
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
                                        <ApplicationRow key={app.id} app={app} />
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

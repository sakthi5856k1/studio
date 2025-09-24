
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, FilePenLine } from "lucide-react";
import galleryData from "@/lib/gallery-images.json";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Footer } from "@/components/app/footer";
import Image from "next/image";
import { DeleteImageDialog } from "./delete-image-dialog";

const images = galleryData.galleryImages;

export default function GalleryAdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-headline">Manage Gallery Images</h1>
            <Button asChild>
              <Link href="/admin/gallery/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Images</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {images.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <Image 
                            src={image.imageUrl}
                            alt={image.id}
                            width={100}
                            height={60}
                            className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/gallery/edit/${image.id}`}>
                                <FilePenLine className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DeleteImageDialog imageId={image.id} />
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

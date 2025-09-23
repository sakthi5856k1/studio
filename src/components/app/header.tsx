import Link from 'next/link';
import { Logo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '#', label: 'Home' },
  { href: '#apply', label: 'Application' },
  { href: '#about', label: 'About' },
  { href: '#staff', label: 'Staff' },
];

const moreLinks = [
    { href: "#gallery", label: "Gallery" },
    { href: "#events", label: "Events" },
];

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 w-full absolute top-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-xl font-headline text-white">Tamil Pasanga</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors outline-none">
              More <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link href={link.href}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="hidden md:block">
          <Button asChild className="rounded-full">
            <Link href="#apply">Apply Now</Link>
          </Button>
        </div>
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6 text-white" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background text-white">
                    <div className="flex flex-col gap-6 p-6">
                        <Link href="/" className="flex items-center gap-2">
                          <Logo size={28} />
                          <span className="text-xl font-headline">Tamil Pasanga</span>
                        </Link>
                        <nav className="flex flex-col gap-4 text-lg">
                           {[...navLinks, ...moreLinks].map((link) => (
                                <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <Button asChild className="rounded-full">
                            <Link href="#apply">Apply Now</Link>
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}

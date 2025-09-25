'use client';

import Link from 'next/link';
import { Logo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/events', label: 'Events' },
  { href: '/staff', label: 'Staff' },
  { href: '/gallery', label: 'Gallery' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 w-full absolute top-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={48} />
          <span className="text-xl font-headline text-white">Tamil Pasanga</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white">
          {navLinks.slice(0, 1).map((link) => (
             <Link
              key={link.href + link.label}
              href={link.href}
              className={cn("hover:text-primary transition-colors", pathname === link.href && "text-primary underline underline-offset-4")}
            >
              {link.label}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 hover:text-primary hover:bg-transparent text-sm text-white p-0"
              >
                Application <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem data-apply-btn>Apply Now</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/application-status">Check Status</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {navLinks.slice(1).map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={cn("hover:text-primary transition-colors", pathname === link.href && "text-primary underline underline-offset-4")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
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
                  <Logo size={48} />
                  <span className="text-xl font-headline">Tamil Pasanga</span>
                </Link>
                <nav className="flex flex-col gap-4 text-lg">
                   {navLinks.slice(0,1).map((link) => (
                     <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={cn("hover:text-primary transition-colors", pathname === link.href && "text-primary underline underline-offset-4")}
                    >
                      {link.label}
                    </Link>
                   ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start gap-1 hover:text-primary hover:bg-transparent text-lg text-white p-0"
                      >
                        Application <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem data-apply-btn>Apply Now</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/application-status">Check Status</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {navLinks.slice(1).map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={cn("hover:text-primary transition-colors", pathname === link.href && "text-primary underline underline-offset-4")}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

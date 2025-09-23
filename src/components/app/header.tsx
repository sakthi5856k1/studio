import Link from 'next/link';
import { Logo } from '@/components/app/logo';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/maintenance', label: 'Application' },
  { href: '/maintenance', label: 'Staff' },
  { href: '/maintenance', label: 'Gallery' },
  { href: '/maintenance', label: 'Events' },
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
            <Link key={link.href + link.label} href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Button className="rounded-full" data-apply-btn>
            Apply Now
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
                           {navLinks.map((link) => (
                                <Link key={link.href + link.label} href={link.href} className="hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <Button className="rounded-full" data-apply-btn>
                           Apply Now
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}

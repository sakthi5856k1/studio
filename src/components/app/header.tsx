import Link from 'next/link';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 w-full absolute top-0 z-20 bg-gradient-to-b from-black/70 to-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Truck className="text-primary" size={28} />
          <span className="text-xl font-headline text-white">Tamil Pasanga</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#process" className="hover:text-primary transition-colors">Process</Link>
          <Link href="#achievements" className="hover:text-primary transition-colors">Achievements</Link>
          <Link href="#news" className="hover:text-primary transition-colors">News</Link>
        </nav>
        <Button asChild className="rounded-full">
          <Link href="#apply">Apply Now</Link>
        </Button>
      </div>
    </header>
  );
}

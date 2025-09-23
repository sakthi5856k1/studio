import Link from 'next/link';
import { Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrentYear } from './current-year';

export function Footer() {
  return (
    <footer className="py-12 bg-black text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Truck className="text-primary" size={24} />
              <span className="text-lg font-headline text-white">Nexon Logistics</span>
            </Link>
            <p className="text-sm">Gateway to New Horizons.</p>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-semibold text-white mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Operations</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Events</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">News</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1">
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Discord</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">TrucksBook</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Steam</Link></li>
            </ul>
          </div>
          <div className="md:col-span-1 space-y-4">
            <Button className="w-full rounded-full" asChild>
              <Link href="#">Shop</Link>
            </Button>
            <Button variant="outline" className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
              <Link href="#">Drivers Hub</Link>
            </Button>
          </div>
        </div>
        <div className="border-t border-border/50 pt-8 text-center text-sm">
          <p>&copy; <CurrentYear /> Nexon Logistics Hub. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

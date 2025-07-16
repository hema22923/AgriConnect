import Link from 'next/link';
import { Leaf, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import CartButton from './cart-button';

const navLinks = [
  { href: '/', label: 'Products' },
  { href: '/orders', label: 'Orders' },
  { href: '/profile', label: 'Profile' },
];

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-primary tracking-wide">
            AgriConnect
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
            <CartButton />
            <div className="md:hidden">
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="grid gap-4 py-6">
                             <Link href="/" className="flex items-center gap-2 mb-4">
                                <Leaf className="h-7 w-7 text-primary" />
                                <span className="text-xl font-bold font-headline text-primary tracking-wide">
                                    AgriConnect
                                </span>
                            </Link>
                            {navLinks.map((link) => (
                                <Link
                                key={link.href}
                                href={link.href}
                                className="flex w-full items-center py-2 text-lg font-semibold"
                                >
                                {link.label}
                                </Link>
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}

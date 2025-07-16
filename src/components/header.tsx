
'use client';

import Link from 'next/link';
import { Leaf, Menu, LogOut, User, Package, ShoppingCart, BarChart3, HelpingHand, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUser, UserType } from '@/context/user-context';
import { useRouter } from 'next/navigation';


const buyerLinks = [
  { href: '/', label: 'Home' },
  { href: '/orders', label: 'My Orders' },
];

const farmerLinks = [
    { href: '/profile', label: 'Dashboard' },
    { href: '/orders', label: 'Orders' },
    { href: '/analytics', label: 'Analytics' },
];

const adminLinks = [
    { href: '/admin', label: 'User Management' },
]


export default function Header() {
  const { userType, setUserType, setUserName } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd clear the user session here
    setUserType('buyer'); // default to buyer view
    setUserName('Guest');
    router.push('/login');
  }

  const getNavLinks = () => {
    switch (userType) {
      case 'farmer':
        return farmerLinks;
      case 'admin':
        return adminLinks;
      case 'buyer':
      default:
        return buyerLinks;
    }
  }

  const navLinks = getNavLinks();

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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" suppressHydrationWarning>
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
                   <Button onClick={handleLogout} variant="outline" className="mt-4" suppressHydrationWarning>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
           <Button onClick={handleLogout} variant="outline" size="sm" className="hidden md:inline-flex" suppressHydrationWarning>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
            </Button>
        </div>
      </div>
    </header>
  );
}

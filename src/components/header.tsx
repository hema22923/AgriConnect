'use client';

import Link from 'next/link';
import { Leaf, Menu, LogOut, User, Package, ShoppingCart, BarChart3, HelpingHand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUser, UserType } from '@/context/user-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import CartButton from './cart-button';


const buyerLinks = [
  { href: '/', label: 'Home' },
  { href: '/orders', label: 'My Orders' },
];

const farmerLinks = [
    { href: '/profile', label: 'Dashboard' },
    { href: '/orders', label: 'Orders' },
    { href: '/analytics', label: 'Analytics' },
];


export default function Header() {
  const { userType, setUserType } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd clear the user session here
    router.push('/login');
  }

  const navLinks = userType === 'buyer' ? buyerLinks : farmerLinks;

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
            {userType === 'buyer' && <CartButton />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className='capitalize'>
                    <User className="mr-2 h-4 w-4" />
                    {userType}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setUserType('buyer')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    <span>Buyer</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUserType('farmer')}>
                    <HelpingHand className="mr-2 h-4 w-4" />
                    <span>Farmer</span>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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

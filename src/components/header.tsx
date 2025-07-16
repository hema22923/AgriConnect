'use client';

import Link from 'next/link';
import { Leaf, Menu, Users, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import CartButton from './cart-button';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/user-context';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const buyerLinks = [
  { href: '/orders', label: 'My Orders' },
];

const farmerLinks = [
    { href: '/profile', label: 'Dashboard' },
];

const ClientOnlyCartButton = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <CartButton /> : <div className="h-10 w-10" />;
}


export default function Header() {
  const { userType, setUserType } = useUser();
  const navLinks = userType === 'buyer' ? buyerLinks : farmerLinks;

  const handleRoleChange = (isFarmer: boolean) => {
    setUserType(isFarmer ? 'farmer' : 'buyer');
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-primary tracking-wide">
            AgriConnect
          </span>
        </Link>
        
        <div className="flex items-center gap-2 text-sm">
            <ShoppingBag className="h-5 w-5"/>
            <Label htmlFor="role-switcher" className={userType === 'buyer' ? 'font-bold text-primary' : ''}>Buyer</Label>
            <Switch
                id="role-switcher"
                checked={userType === 'farmer'}
                onCheckedChange={handleRoleChange}
            />
            <Label htmlFor="role-switcher" className={userType === 'farmer' ? 'font-bold text-primary' : ''}>Farmer</Label>
            <Users className="h-5 w-5"/>
        </div>

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
            {userType === 'buyer' && <ClientOnlyCartButton />}
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


'use client';

import Link from 'next/link';
import { Leaf, Menu, LogOut, Package, ShoppingCart, BarChart3, ShieldCheck, User, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUser } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import CartButton from './cart-button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';


const buyerLinks = [
  { href: '/', label: 'Home', icon: Package },
  { href: '/orders', label: 'My Orders', icon: ShoppingCart },
];

const farmerLinks = [
    { href: '/profile', label: 'Dashboard', icon: User },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const adminLinks = [
    { href: '/admin', label: 'User Management', icon: ShieldCheck },
]


export default function Header() {
  const { userType, userName, setUserType, setUserName, setUserEmail } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    setUserType('buyer'); // default to buyer view
    setUserName('Guest');
    setUserEmail(null);
    router.push('/login');
  }

  const getNavLinks = () => {
    if (userName === 'Guest') {
        return [];
    }
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

        <div className="flex items-center gap-2">
           {userType === 'buyer' && userName !== 'Guest' && <CartButton />}
           
           {userName === 'Guest' ? (
             <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost">
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/register">
                         <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                    </Link>
                </Button>
             </div>
           ) : (
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                      <AvatarImage src={`https://i.pravatar.cc/40?u=${userName}`} />
                      <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : 'G'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none" suppressHydrationWarning>{userName}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
           )}

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
                      <link.icon className="mr-2 h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                  <DropdownMenuSeparator />
                   {userName === 'Guest' ? (
                     <>
                        <Link href="/login" className="flex w-full items-center py-2 text-lg font-semibold">
                            <LogIn className="mr-2 h-5 w-5" />
                            Login
                        </Link>
                         <Link href="/register" className="flex w-full items-center py-2 text-lg font-semibold">
                            <UserPlus className="mr-2 h-5 w-5" />
                            Sign Up
                        </Link>
                     </>
                   ) : (
                     <button onClick={handleLogout} className="flex w-full items-center py-2 text-lg font-semibold text-left">
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                     </button>
                   )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

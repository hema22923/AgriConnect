
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { useUser } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
  const router = useRouter();
  const { userType, userName, isLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // This effect runs when the user context is loaded or changes.
    // If the user is successfully logged in, redirect them.
    if (!isLoading && userName !== 'Guest') {
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userName}!`,
      });

      if (userType === 'farmer') {
        router.push('/profile');
      } else if (userType === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [userType, userName, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect hook will handle redirection and success toast.
    } catch (error: any) {
       console.error("Login Error:", error);
       let errorMessage = 'An unexpected error occurred.';
       if (error instanceof FirebaseError) {
         if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please try again.';
         } else if (error.code === 'unavailable' || error.code === 'auth/network-request-failed') {
            errorMessage = 'Failed to connect to the database. Please check your internet connection and try again.';
         }
       }
       toast({
          title: 'Login Failed',
          description: errorMessage,
          variant: 'destructive',
        });
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Leaf className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                suppressHydrationWarning
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suppressHydrationWarning
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" suppressHydrationWarning disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to your cart before checking out.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    
    // In a real app, you would save the order to a database here
    // And also update the stock
    try {
      // Create a batch write to update all product stocks atomically
      for (const item of cart) {
        const productRef = doc(db, 'products', item.product.id);
        await updateDoc(productRef, {
          stock: increment(-item.quantity),
        });
      }

      // Simulate API call for order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsProcessing(false);
      setIsOrderPlaced(true);
      clearCart();
      
      setTimeout(() => {
        router.push('/orders');
      }, 2000);

    } catch (error) {
       console.error("Order processing failed: ", error);
       toast({
        title: "Order Failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive"
       });
       setIsProcessing(false);
    }
  };

  if (isOrderPlaced) {
    return (
        <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto py-20">
            <CheckCircle className="w-24 h-24 text-green-500 animate-in zoom-in-50" />
            <h1 className="text-4xl font-headline font-bold mt-6">Thank You!</h1>
            <p className="text-lg text-muted-foreground mt-2">Your order has been placed successfully.</p>
            <p className="text-sm text-muted-foreground mt-4">Redirecting you to your orders...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-8 items-start">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" placeholder="123 Farmhouse Lane" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Green Valley" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input id="zip" placeholder="12345" required />
            </div>
          </CardContent>
           <CardHeader className="pt-0">
            <CardTitle className="font-headline">Payment Details</CardTitle>
          </CardHeader>
           <CardContent>
              <p className="text-sm text-muted-foreground p-4 text-center border-dashed border rounded-lg">
                Payment gateway integration is simulated for this demonstration.
              </p>
           </CardContent>
        </Card>
        <div className="md:col-span-1 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground truncate pr-2">{item.product.name} ({item.quantity} kg)</span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                 <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button type="submit" disabled={isProcessing} className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
                    {isProcessing ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                    {isProcessing ? 'Processing...' : `Place Order`}
                 </Button>
              </CardFooter>
            </Card>
        </div>
      </form>
    </div>
  );
}

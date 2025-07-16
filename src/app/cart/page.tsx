'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, itemCount } = useCart();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-8">Your Cart</h1>
      {itemCount > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-6">
                {cart.map((item, index) => (
                  <div key={item.product.id}>
                    <div className="flex items-start gap-4">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                        data-ai-hint={item.product.aiHint}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.seller}</p>
                        <p className="font-bold text-primary mt-1">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <div className="flex items-center gap-2">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                               <MinusCircle className="h-5 w-5"/>
                           </Button>
                           <span className="font-bold w-4 text-center">{item.quantity}</span>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                               <PlusCircle className="h-5 w-5"/>
                           </Button>
                         </div>
                         <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                            <Trash2 className="h-4 w-4 mr-1"/> Remove
                         </Button>
                      </div>
                    </div>
                    {index < cart.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator/>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button asChild className="w-full h-12 text-lg bg-accent hover:bg-accent/90">
                    <Link href="/checkout">Proceed to Checkout</Link>
                 </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-center p-12">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4"/>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven&apos;t added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}

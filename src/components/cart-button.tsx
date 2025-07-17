
'use client';

import { ShoppingCart, MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

export default function CartButton() {
  const { cart, itemCount, cartTotal, updateQuantity, removeFromCart } = useCart();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative" suppressHydrationWarning>
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-accent text-accent-foreground"
            >
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4">
          <h4 className="font-medium text-lg">Shopping Cart</h4>
        </div>
        <Separator />
        {cart.length > 0 ? (
          <>
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint={item.product.aiHint}
                    />
                    <div className="flex-1 space-y-1">
                      <h5 className="font-medium">{item.product.name}</h5>
                      <div className="flex items-center justify-between">
                         <p className="text-sm text-muted-foreground">
                            ₹{item.product.price.toFixed(2)} / kg
                         </p>
                         <div className="flex items-center gap-2">
                           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                               <MinusCircle className="h-4 w-4"/>
                           </Button>
                           <span>{item.quantity}</span>
                           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                               <PlusCircle className="h-4 w-4"/>
                           </Button>
                         </div>
                      </div>
                    </div>
                     <Button variant="ghost" size="icon" className="h-6 w-6 self-start text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="p-4 space-y-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <Button asChild className="w-full bg-accent hover:bg-accent/90">
                <Link href="/checkout">Go to Checkout</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

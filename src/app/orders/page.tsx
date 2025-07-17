
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, ChevronRight, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/user-context';
import type { Order } from '@/lib/types';
import { fetchOrdersForUser, updateProductRating, updateOrderItemAsRated } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

function RatingDialog({ open, onOpenChange, orderId, item, onRatingSubmitted }: { open: boolean, onOpenChange: (open: boolean) => void, orderId: string, item: any, onRatingSubmitted: (orderId: string, productId: string) => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProductRating(item.productId, rating);
      await updateOrderItemAsRated(orderId, item.productId);
      toast({ title: "Thank you for your feedback!" });
      onRatingSubmitted(orderId, item.productId);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to submit rating:", error);
      toast({ title: "Failed to submit rating", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate {item.name}</DialogTitle>
          <DialogDescription>
            Tell us what you thought of this product. Your feedback helps other buyers and farmers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center gap-2 py-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-10 w-10 cursor-pointer transition-colors",
                (hoverRating >= star || rating >= star) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              )}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmitRating} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Rating
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage() {
    const { uid } = useUser();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRatingItem, setSelectedRatingItem] = useState<{orderId: string, item: any} | null>(null);

    useEffect(() => {
        if (uid) {
            const getOrders = async () => {
                setIsLoading(true);
                const userOrders = await fetchOrdersForUser(uid);
                setOrders(userOrders);
                setIsLoading(false);
            };
            getOrders();
        } else {
          setIsLoading(false);
        }
    }, [uid, router]);

    const handleRatingSubmitted = (orderId: string, productId: string) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId
                ? {
                    ...order,
                    items: order.items.map(item =>
                        item.productId === productId ? { ...item, isRated: true } : item
                    )
                  }
                : order
            )
        );
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-muted-foreground">Loading your orders...</p>
            </div>
        )
    }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-8">My Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
                <CardHeader className="flex flex-row justify-between items-center bg-secondary/30 p-4">
                    <div className='space-y-1'>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <CardDescription>Placed on {order.date ? new Date(order.date.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not available'}</CardDescription>
                    </div>
                    <div className='text-right'>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-lg text-primary">₹{order.total.toFixed(2)}</p>
                    </div>
                </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p>{item.name} <span className="text-muted-foreground">x {item.quantity} kg</span></p>
                         <p className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      {order.status === 'Delivered' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRatingItem({orderId: order.id, item})}
                            disabled={item.isRated}
                        >
                            <Star className="mr-2 h-4 w-4"/>
                            {item.isRated ? 'Rated' : 'Rate Product'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center bg-secondary/30 p-4">
                <Badge
                  className={cn(
                    order.status === 'Delivered' && 'bg-green-100 text-green-800 border-green-200',
                    order.status === 'Shipped' && 'bg-blue-100 text-blue-800 border-blue-200',
                    order.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    order.status === 'Cancelled' && 'bg-red-100 text-red-800 border-red-200'
                  )}
                >
                  {order.status}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
         <Card className="text-center p-12">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">You haven&apos;t placed any orders. Let&apos;s change that!</p>
            <Button asChild>
                <Link href="/">Start Shopping</Link>
            </Button>
        </Card>
      )}

      {selectedRatingItem && (
        <RatingDialog
          open={!!selectedRatingItem}
          onOpenChange={(isOpen) => !isOpen && setSelectedRatingItem(null)}
          orderId={selectedRatingItem.orderId}
          item={selectedRatingItem.item}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
}

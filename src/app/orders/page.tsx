
import { orders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-8">My Orders</h1>
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
                <CardHeader className="flex flex-row justify-between items-center bg-secondary/30 p-4">
                    <div className='space-y-1'>
                        <CardTitle className="text-lg">Order #{order.id.split('_')[1]}</CardTitle>
                        <CardDescription>Placed on {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                    </div>
                    <div className='text-right'>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-lg text-primary">${order.total.toFixed(2)}</p>
                    </div>
                </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {order.items.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center">
                      <p>{item.product.name} <span className="text-muted-foreground">x {item.quantity} kg</span></p>
                      <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
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
                <Button asChild variant="ghost">
                  <Link href={`/orders/${order.id}`}>
                    View Details <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
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
    </div>
  );
}

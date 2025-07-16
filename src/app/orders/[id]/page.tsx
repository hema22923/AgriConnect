import { orders, products } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import SmartReply from '@/components/smart-reply';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
  }
  
  const productForReply = order.items.length > 0 ? order.items[0].product : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Order Details</h1>
        <p className="text-muted-foreground">Order #{order.id.split('_')[1]} &bull; Placed on {new Date(order.date).toLocaleDateString()}</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                {order.items.map((item, index) => (
                    <div key={item.product.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-none">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint={item.product.aiHint}
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                ))}
                </CardContent>
            </Card>

            {order.buyerQuestion && productForReply && (
                <SmartReply product={productForReply} buyerQuestion={order.buyerQuestion} />
            )}
        </div>

        <div className="md:col-span-1 sticky top-24 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status</span>
                        <Badge
                        className={cn(
                            'text-xs',
                            order.status === 'Delivered' && 'bg-green-100 text-green-800 border-green-200',
                            order.status === 'Shipped' && 'bg-blue-100 text-blue-800 border-blue-200',
                            order.status === 'Pending' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                            order.status === 'Cancelled' && 'bg-red-100 text-red-800 border-red-200'
                        )}
                        >
                        {order.status}
                        </Badge>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-4 border-t">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Buyer Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="font-semibold">{order.buyerName}</p>
                    <p className="text-sm text-muted-foreground">123 Farmhouse Lane, Green Valley, 12345</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


'use client';

import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const StarRating = ({ rating, reviewCount }: { rating: number, reviewCount: number }) => {
  const validRating = typeof rating === 'number' ? rating : 0;
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars > 0 ? fullStars : 0)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {/* Note: No half star for simplicity, can be added later */}
      {[...Array(emptyStars > 0 ? emptyStars : 0)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
      <span className="text-xs text-muted-foreground ml-1">({reviewCount || 0})</span>
    </div>
  );
};


export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <div className="relative w-full aspect-video">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.aiHint}
          />
        </div>
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 right-2">Out of Stock</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow space-y-1">
        <CardTitle className="text-lg font-headline mb-1">{product.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{product.seller}</p>
        <div className="flex justify-between items-center">
             <StarRating rating={product.rating} reviewCount={product.reviewCount} />
             <p className="text-xs text-muted-foreground">{product.stock} kg in stock</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">₹{product.price.toFixed(2)} / kg</p>
        <Button size="sm" onClick={() => addToCart(product)} disabled={isOutOfStock}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}

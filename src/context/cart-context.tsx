
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import type { Product, CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './user-context';
import { useRouter } from 'next/navigation';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const previousCartRef = useRef<CartItem[]>([]);
  const { uid } = useUser();
  const router = useRouter();

  useEffect(() => {
    const previousCart = previousCartRef.current;
    const currentCart = cart;

    // Check if an item was removed
    if (currentCart.length < previousCart.length) {
      toast({
        title: "Removed from cart",
        variant: "destructive",
        description: `An item has been removed from your cart.`,
      });
    } else {
      // Check if an item was added or quantity increased
      const itemAddedOrUpdated = currentCart.find(currentItem => {
        const prevItem = previousCart.find(p => p.product.id === currentItem.product.id);
        return !prevItem || currentItem.quantity > (prevItem?.quantity || 0);
      });

      if (itemAddedOrUpdated && previousCartRef.current.length > 0) { // Don't toast on initial load
         toast({
          title: "Added to cart",
          description: `${itemAddedOrUpdated.product.name} has been added to your cart.`,
        });
      }
    }

    previousCartRef.current = cart;
  }, [cart, toast]);

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!uid) {
        toast({
            title: 'Please Login',
            description: 'You need to be logged in to add items to your cart.',
            variant: 'destructive',
        });
        router.push('/login');
        return;
    }

    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently unavailable.`,
        variant: "destructive",
      });
      return;
    }
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantityInCart + quantity;
  
      if (newQuantity > product.stock) {
        toast({
          title: "Limited Stock",
          description: `You can only add up to ${product.stock} kg of ${product.name}.`,
          variant: "destructive",
        });
        if (existingItem) {
          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        return [...prevCart, { product, quantity: product.stock }];
      }
  
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const itemInCart = prevCart.find(item => item.product.id === productId);
      if (!itemInCart) return prevCart;

      if (quantity > itemInCart.product.stock) {
         toast({
            title: "Limited Stock",
            description: `Only ${itemInCart.product.stock} kg of ${itemInCart.product.name} available.`,
            variant: "destructive",
        });
        return prevCart.map((item) =>
            item.product.id === productId ? { ...item, quantity: itemInCart.product.stock } : item
          );
      }

      if (quantity <= 0) {
        return prevCart.filter((item) => item.product.id !== productId);
      }

      return prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        );
      }
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

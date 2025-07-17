
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product, CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      if (product.stock <= 0) {
        toast({
          title: "Out of Stock",
          description: `${product.name} is currently unavailable.`,
          variant: "destructive",
        });
        return prevCart;
      }

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
          return prevCart.map(item =>
            item.product.id === product.id ? { ...item, quantity: product.stock } : item
          );
        }
        return [...prevCart, { product, quantity: product.stock }];
      }

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => item.product.id === productId);
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          variant: "destructive",
          description: `Item has been removed from your cart.`,
        });
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
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
          const itemToRemove = prevCart.find((item) => item.product.id === productId);
          if (itemToRemove) {
            toast({
              title: "Removed from cart",
              variant: "destructive",
              description: `Item has been removed from your cart.`,
            });
          }
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

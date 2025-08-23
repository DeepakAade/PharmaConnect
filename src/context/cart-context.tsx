'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Medicine } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: Medicine[];
  addToCart: (item: Medicine) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Medicine[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((item: Medicine) => {
    setCart((prevCart) => [...prevCart, item]);
    toast({
      title: 'Added to cart',
      description: `${item.name} has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
     toast({
      title: 'Removed from cart',
      description: `Item has been removed from your cart.`,
      variant: 'destructive',
    });
  }, [toast]);

  const clearCart = useCallback(() => {
    setCart([]);
     toast({
      title: 'Cart cleared',
      description: `All items have been removed from your cart.`,
       variant: 'destructive',
    });
  }, [toast]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount: cart.length }}>
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

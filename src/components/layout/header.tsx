'use client';

import { CurrencySelector } from '@/components/currency/currency-selector';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';

type HeaderProps = {
  title: string;
  description?: string;
};

export function Header({ title, description }: HeaderProps) {
  const { cartCount } = useCart();
  return (
    <header className="flex items-center gap-4 border-b bg-card p-4 h-16 shrink-0">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl font-headline">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <CurrencySelector />
        <Button asChild variant="outline" size="icon">
           <Link href="/cart">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
            <span className="sr-only">My Cart</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}

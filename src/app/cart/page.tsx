'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { useCurrency } from '@/context/currency-context';
import { convertCurrency, formatCurrency } from '@/lib/utils';
import { Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { currency } = useCurrency();

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const convertedTotal = convertCurrency(total, 'USD', currency);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="My Cart"
        description="Review and manage the items in your cart."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Medicine</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item) => {
                        const convertedPrice = convertCurrency(item.price, 'USD', currency);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                                data-ai-hint={`${item.form} medicine`}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{item.manufacturer}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(convertedPrice, currency)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
                 <CardFooter className="justify-end">
                    <Button variant="outline" onClick={clearCart}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Cart
                    </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(convertedTotal, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(convertedTotal, currency)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-card rounded-lg border p-12 min-h-[400px]">
            <div className="bg-primary/10 p-4 rounded-full">
              <ShoppingCart className="w-12 h-12 text-primary" />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Your Cart is Empty</h3>
            <p className="mt-2 text-muted-foreground">
              Looks like you haven't added any medicines to your cart yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

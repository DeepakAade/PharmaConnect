'use client';

import Image from 'next/image';
import type { Medicine } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Factory, Pill, ShoppingCart, Info } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import { convertCurrency, formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import Link from 'next/link';


type MedicineCardProps = {
  medicine: Medicine;
};

export function MedicineCard({ medicine }: MedicineCardProps) {
  const { currency } = useCurrency();
  const { addToCart } = useCart();
  const convertedPrice = convertCurrency(medicine.price, 'USD', currency);
  
  const handleAddToCart = () => {
    addToCart(medicine);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={medicine.imageUrl}
            alt={medicine.name}
            fill
            className="object-cover"
            data-ai-hint={`${medicine.form} medicine`}
          />
           {!medicine.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <CardTitle className="text-lg font-headline">{medicine.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-1">
            <Factory className="w-4 h-4" /> {medicine.manufacturer}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Pill className="w-3 h-3" />
            {medicine.form}
          </Badge>
          <Badge variant="outline">{medicine.therapeuticCategory}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-semibold text-primary">
          {formatCurrency(convertedPrice, currency)}
        </p>
        {medicine.inStock ? (
          <Button onClick={handleAddToCart}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link href="/find-manufacturer">
                <Info className="w-4 h-4 mr-2" />
                Find Alternatives
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

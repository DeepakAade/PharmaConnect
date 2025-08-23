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
import { Factory, Pill } from 'lucide-react';

type MedicineCardProps = {
  medicine: Medicine;
};

export function MedicineCard({ medicine }: MedicineCardProps) {
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
          ${medicine.price.toFixed(2)}
        </p>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
}

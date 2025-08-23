'use client';

import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { medicines } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import { useCurrency } from '@/context/currency-context';
import { convertCurrency, formatCurrency } from '@/lib/utils';


// Filter for a single manufacturer for demonstration
const manufacturerMedicines = medicines.filter(
  (m) => m.manufacturer === 'Pharma Inc.'
);

export default function ManufacturerDashboardPage() {
  const { currency } = useCurrency();
  
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Manufacturer Dashboard"
        description="Welcome, Pharma Inc."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Medicine Listings</CardTitle>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Medicine
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {manufacturerMedicines.map((medicine) => {
                  const convertedPrice = convertCurrency(medicine.price, 'USD', currency);
                  return (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">
                        {medicine.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{medicine.form}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {medicine.therapeuticCategory}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(convertedPrice, currency)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

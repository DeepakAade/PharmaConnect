'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MedicineCard } from './medicine-card';
import type { Medicine } from '@/types';
import { Search, Filter, Pill } from 'lucide-react';

type MedicineListProps = {
  medicines: Medicine[];
};

const medicineForms = [
  'Tablet',
  'Capsule',
  'Liquid',
  'Syrup',
  'Injection',
  'Ointment',
];
const therapeuticCategories = [
  'Analgesic',
  'Antibiotic',
  'Antiviral',
  'Cardiovascular',
  'Respiratory',
  'Gastrointestinal',
];

export function MedicineList({ medicines }: MedicineListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [formFilter, setFormFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        medicine.name.toLowerCase().includes(searchLower) ||
        medicine.manufacturer.toLowerCase().includes(searchLower);

      const matchesForm =
        formFilter === 'all' || medicine.form === formFilter;
      const matchesCategory =
        categoryFilter === 'all' ||
        medicine.therapeuticCategory === categoryFilter;

      return matchesSearch && matchesForm && matchesCategory;
    });
  }, [medicines, searchTerm, formFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-card rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
            <Select value={formFilter} onValueChange={setFormFilter}>
              <SelectTrigger>
                <Pill className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                {medicineForms.map((form) => (
                  <SelectItem key={form} value={form}>
                    {form}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {therapeuticCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredMedicines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedicines.map((medicine) => (
            <MedicineCard key={medicine.id} medicine={medicine} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center bg-card rounded-lg border p-12 min-h-[400px]">
          <div className="bg-primary/10 p-4 rounded-full">
            <Search className="w-12 h-12 text-primary" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">No Medicines Found</h3>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}

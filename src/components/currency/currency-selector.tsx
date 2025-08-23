
'use client';

import { useCurrency, currencies, Currency } from '@/context/currency-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign, Euro, PoundSterling, IndianRupee, JapaneseYen } from 'lucide-react';

const currencyIcons = {
  USD: <DollarSign className="w-4 h-4" />,
  EUR: <Euro className="w-4 h-4" />,
  GBP: <PoundSterling className="w-4 h-4" />,
  INR: <IndianRupee className="w-4 h-4" />,
  JPY: <JapaneseYen className="w-4 h-4" />,
};

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
      <SelectTrigger className="w-[140px]">
        <div className="flex items-center gap-2">
          {currencyIcons[currency]}
          <SelectValue placeholder="Select currency" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c} value={c}>
            <div className="flex items-center gap-2">
              {currencyIcons[c]}
              <span>{c}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

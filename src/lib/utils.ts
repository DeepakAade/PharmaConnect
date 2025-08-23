import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Currency } from "@/context/currency-context"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const conversionRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  JPY: 157.0,
  GBP: 0.79,
  INR: 83.3,
};

export function convertCurrency(price: number, from: Currency, to: Currency) {
  const priceInUsd = price / conversionRates[from];
  const convertedPrice = priceInUsd * conversionRates[to];
  return convertedPrice;
}

export function formatCurrency(price: number, currency: Currency) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
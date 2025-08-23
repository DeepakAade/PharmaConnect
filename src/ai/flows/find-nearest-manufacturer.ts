'use server';

/**
 * @fileOverview An AI-powered tool to find the nearest pharmaceutical manufacturer for a given medicine if it's out of stock.
 * - findNearestManufacturer - The main function to find the nearest manufacturer.
 * - FindNearestManufacturerInput - The input type for the findNearestManufacturer function.
 * - FindNearestManufacturerOutput - The return type for the findNearestManufacturer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { medicines, manufacturers } from '@/lib/data';

// Schemas
export const FindNearestManufacturerInputSchema = z.object({
  medicineName: z.string().describe('The name of the medicine to check for.'),
  userLocation: z.string().describe('The user\'s current location (e.g., city, zip code).'),
});
export type FindNearestManufacturerInput = z.infer<typeof FindNearestManufacturerInputSchema>;

export const FindNearestManufacturerOutputSchema = z.object({
  inStock: z.boolean().describe('Whether the medicine is in stock.'),
  message: z.string().describe('A message to the user about the stock status or suggestion.'),
  nearestManufacturer: z.object({
    name: z.string(),
    location: z.string(),
  }).optional().describe('The nearest manufacturer if the medicine is out of stock.'),
});
export type FindNearestManufacturerOutput = z.infer<typeof FindNearestManufacturerOutputSchema>;


// Tool to check stock
const getMedicineStockStatus = ai.defineTool(
    {
        name: 'getMedicineStockStatus',
        description: 'Checks if a given medicine is in stock.',
        inputSchema: z.object({ medicineName: z.string() }),
        outputSchema: z.object({ inStock: z.boolean(), manufacturer: z.string().optional() }),
    },
    async ({ medicineName }) => {
        const medicine = medicines.find(m => m.name.toLowerCase().includes(medicineName.toLowerCase()));
        return {
            inStock: medicine?.inStock ?? false,
            manufacturer: medicine?.manufacturer,
        };
    }
);


// Tool to find nearest manufacturer
const findNearestManufacturerTool = ai.defineTool(
    {
        name: 'findNearestManufacturer',
        description: 'Finds the nearest manufacturer to a user\'s location.',
        inputSchema: z.object({ userLocation: z.string(), medicineManufacturer: z.string().optional() }),
        outputSchema: z.object({ name: z.string(), location: z.string() }).optional(),
    },
    async ({ userLocation, medicineManufacturer }) => {
        // This is a simplified logic. In a real-world scenario, you'd use a mapping API.
        // For now, we'll just return the first one that doesn't match the original manufacturer, or the first one.
        const originalManufacturer = manufacturers.find(m => m.name === medicineManufacturer);
        const otherManufacturers = manufacturers.filter(m => m.name !== medicineManufacturer);

        if (otherManufacturers.length > 0) {
            return otherManufacturers[0];
        }
        return manufacturers[0];
    }
);

// Main function to be called from the UI
export async function findNearestManufacturer(
  input: FindNearestManufacturerInput
): Promise<FindNearestManufacturerOutput> {
  return findNearestManufacturerFlow(input);
}


const prompt = ai.definePrompt({
    name: 'findNearestManufacturerPrompt',
    input: { schema: FindNearestManufacturerInputSchema },
    output: { schema: FindNearestManufacturerOutputSchema },
    tools: [getMedicineStockStatus, findNearestManufacturerTool],
    prompt: `You are a helpful pharmacy assistant. A user is looking for a medicine.
    1. First, check if the medicine '{{medicineName}}' is in stock using the getMedicineStockStatus tool.
    2. If it is in stock, inform the user with a helpful message and set inStock to true.
    3. If it is out of stock, use the findNearestManufacturer tool to find an alternative manufacturer near '{{userLocation}}'.
    4. Provide the user with the name and location of the nearest manufacturer and a message that they could contact them. Set inStock to false.
    `,
});


// Genkit Flow
const findNearestManufacturerFlow = ai.defineFlow(
  {
    name: 'findNearestManufacturerFlow',
    inputSchema: FindNearestManufacturerInputSchema,
    outputSchema: FindNearestManufacturerOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

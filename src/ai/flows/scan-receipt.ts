'use server';

/**
 * @fileOverview AI-powered tool to scan and extract information from a doctor's medical receipt.
 *
 * - scanReceipt - A function that handles the receipt scanning process.
 * - ScanReceiptInput - The input type for the scanReceipt function.
 * - ScanReceiptOutput - The return type for the scanReceipt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const ScanReceiptInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a medical receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanReceiptInput = z.infer<typeof ScanReceiptInputSchema>;

export const ScanReceiptOutputSchema = z.object({
  patientName: z.string().optional().describe('The name of the patient.'),
  doctorName: z.string().optional().describe('The name of the doctor.'),
  medications: z
    .array(
      z.object({
        name: z.string().describe('The name of the medication.'),
        dosage: z.string().describe('The dosage of the medication (e.g., 500mg).'),
        quantity: z.string().describe('The quantity of the medication (e.g., 30 tablets).'),
      })
    )
    .describe('A list of medications found on the receipt.'),
});
export type ScanReceiptOutput = z.infer<typeof ScanReceiptOutputSchema>;

export async function scanReceipt(input: ScanReceiptInput): Promise<ScanReceiptOutput> {
  return scanReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanReceiptPrompt',
  input: { schema: ScanReceiptInputSchema },
  output: { schema: ScanReceiptOutputSchema },
  prompt: `You are an expert at reading medical receipts.
  Analyze the following image of a doctor's receipt and extract the following information:
  - Patient's Name
  - Doctor's Name
  - A list of all prescribed medications, including their name, dosage, and quantity.

  If any information is not present, leave the corresponding field empty.
  Photo: {{media url=photoDataUri}}`,
});

const scanReceiptFlow = ai.defineFlow(
  {
    name: 'scanReceiptFlow',
    inputSchema: ScanReceiptInputSchema,
    outputSchema: ScanReceiptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

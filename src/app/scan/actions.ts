'use server';

import {
  scanReceipt as scanReceiptFlow,
  type ScanReceiptInput,
  type ScanReceiptOutput,
} from '@/ai/flows/scan-receipt';
import { z } from 'zod';

const inputSchema = z.object({
  receiptImage: z.string().min(1, 'Please provide an image.'),
});

type FormState = {
  status: 'success' | 'error' | 'idle';
  message: string;
  data?: ScanReceiptOutput;
};

export async function scanReceipt(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = Object.fromEntries(formData);
  const validatedFields = inputSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      status: 'error',
      message:
        validatedFields.error.errors.map((e) => e.message).join(', ') ||
        'Invalid input provided.',
    };
  }

  try {
    const input: ScanReceiptInput = {
      photoDataUri: validatedFields.data.receiptImage,
    };
    const result = await scanReceiptFlow(input);
    return {
      status: 'success',
      message: 'Receipt scanned successfully.',
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message:
        'An error occurred while scanning the receipt. Please try again.',
    };
  }
}

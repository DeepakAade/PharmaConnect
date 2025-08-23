'use server';

import {
  suggestAlternativeMedications,
  type SuggestAlternativeMedicationsInput,
  type SuggestAlternativeMedicationsOutput,
} from '@/ai/flows/suggest-alternative-medications';
import { z } from 'zod';

const inputSchema = z.object({
  searchCriteria: z.string().min(3, 'Please enter at least 3 characters.'),
  userInput: z.string().min(10, 'Please provide more details.'),
  medicationHistory: z.string().optional(),
});

type FormState = {
  status: 'success' | 'error' | 'idle';
  message: string;
  data?: SuggestAlternativeMedicationsOutput;
};

export async function getSuggestions(
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
    const input: SuggestAlternativeMedicationsInput = validatedFields.data;
    const result = await suggestAlternativeMedications(input);
    return {
      status: 'success',
      message: 'Suggestions generated successfully.',
      data: result,
    };
  } catch (error) {
    return {
      status: 'error',
      message:
        'An error occurred while generating suggestions. Please try again.',
    };
  }
}

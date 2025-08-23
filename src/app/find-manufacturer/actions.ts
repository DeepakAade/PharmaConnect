'use server';

import {
  findNearestManufacturer,
  type FindNearestManufacturerInput,
  type FindNearestManufacturerOutput,
} from '@/ai/flows/find-nearest-manufacturer';
import { z } from 'zod';

const inputSchema = z.object({
  medicineName: z.string().min(3, 'Please enter a medicine name.'),
  userLocation: z.string().min(3, 'Please enter your location.'),
});

type FormState = {
  status: 'success' | 'error' | 'idle';
  message: string;
  data?: FindNearestManufacturerOutput;
};

export async function findManufacturer(
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
    const input: FindNearestManufacturerInput = validatedFields.data;
    const result = await findNearestManufacturer(input);
    return {
      status: 'success',
      message: result.message,
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 'error',
      message:
        'An error occurred while finding a manufacturer. Please try again.',
    };
  }
}

'use server';

/**
 * @fileOverview AI-powered tool suggests related or alternative medications based on search criteria and user input.
 *
 * - suggestAlternativeMedications - A function that handles the suggestion process.
 * - SuggestAlternativeMedicationsInput - The input type for the suggestAlternativeMedications function.
 * - SuggestAlternativeMedicationsOutput - The return type for the suggestAlternativeMedications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeMedicationsInputSchema = z.object({
  searchCriteria: z
    .string()
    .describe('The search criteria entered by the user (e.g., medicine name, ingredient, symptoms).'),
  userInput: z.string().describe('Additional user input or description of their needs.'),
  medicationHistory: z
    .string()
    .optional()
    .describe('The medication history of the user, optional.'),
});
export type SuggestAlternativeMedicationsInput = z.infer<typeof SuggestAlternativeMedicationsInputSchema>;

const SuggestAlternativeMedicationsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of related or alternative medication suggestions.'),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the suggestions, explaining why these medications are recommended.'),
});
export type SuggestAlternativeMedicationsOutput = z.infer<typeof SuggestAlternativeMedicationsOutputSchema>;

export async function suggestAlternativeMedications(
  input: SuggestAlternativeMedicationsInput
): Promise<SuggestAlternativeMedicationsOutput> {
  return suggestAlternativeMedicationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeMedicationsPrompt',
  input: {schema: SuggestAlternativeMedicationsInputSchema},
  output: {schema: SuggestAlternativeMedicationsOutputSchema},
  prompt: `You are an AI assistant that suggests related or alternative medications based on user search criteria and input.

  Based on the following search criteria and user input, provide a list of alternative medication suggestions and explain your reasoning for each suggestion.

  Search Criteria: {{{searchCriteria}}}
  User Input: {{{userInput}}}
  Medication History (Optional): {{{medicationHistory}}}

  Suggestions should be tailored to the user's needs and preferences, and the reasoning should be clear and concise.
  Format your reponse as a json object with keys \"suggestions\" and \"reasoning\". \"suggestions\" is an array of strings. \"reasoning\" is a string.
  `,
});

const suggestAlternativeMedicationsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeMedicationsFlow',
    inputSchema: SuggestAlternativeMedicationsInputSchema,
    outputSchema: SuggestAlternativeMedicationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

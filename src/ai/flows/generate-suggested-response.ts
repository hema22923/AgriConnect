// use server'

/**
 * @fileOverview Flow for generating suggested responses to buyer questions about a product listing.
 *
 * - generateSuggestedResponse - A function that generates suggested responses.
 * - GenerateSuggestedResponseInput - The input type for the generateSuggestedResponse function.
 * - GenerateSuggestedResponseOutput - The return type for the generateSuggestedResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuggestedResponseInputSchema = z.object({
  productListing: z.string().describe('The product listing details, including description, price, and other relevant information.'),
  buyerQuestion: z.string().describe('The question asked by the buyer about the product listing.'),
});
export type GenerateSuggestedResponseInput = z.infer<typeof GenerateSuggestedResponseInputSchema>;

const GenerateSuggestedResponseOutputSchema = z.object({
  suggestedResponse: z.string().describe('The AI-generated suggested response to the buyer question.'),
});
export type GenerateSuggestedResponseOutput = z.infer<typeof GenerateSuggestedResponseOutputSchema>;

export async function generateSuggestedResponse(input: GenerateSuggestedResponseInput): Promise<GenerateSuggestedResponseOutput> {
  return generateSuggestedResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuggestedResponsePrompt',
  input: {schema: GenerateSuggestedResponseInputSchema},
  output: {schema: GenerateSuggestedResponseOutputSchema},
  prompt: `You are an AI assistant helping farmers automatically respond to common buyer questions about their product listings.

  Given the following product listing details and the buyer's question, generate a suggested response that is helpful, informative, and encourages the buyer to purchase the product.

  Product Listing Details: {{{productListing}}}
  Buyer Question: {{{buyerQuestion}}}

  Suggested Response:`, // Ensure the AI knows what is expected as a response.
});

const generateSuggestedResponseFlow = ai.defineFlow(
  {
    name: 'generateSuggestedResponseFlow',
    inputSchema: GenerateSuggestedResponseInputSchema,
    outputSchema: GenerateSuggestedResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

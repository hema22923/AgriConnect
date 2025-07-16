'use server';

/**
 * @fileOverview Implements an AI chatbot flow for answering user queries about the AgriConnect platform.
 *
 * - intelligentAssistant - A function that handles user queries and provides information about the AgriConnect platform.
 * - IntelligentAssistantInput - The input type for the intelligentAssistant function.
 * - IntelligentAssistantOutput - The return type for the intelligentAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentAssistantInputSchema = z.object({
  query: z.string().describe('The user query about the AgriConnect platform.'),
});
export type IntelligentAssistantInput = z.infer<typeof IntelligentAssistantInputSchema>;

const IntelligentAssistantOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the user query.'),
});
export type IntelligentAssistantOutput = z.infer<typeof IntelligentAssistantOutputSchema>;

export async function intelligentAssistant(input: IntelligentAssistantInput): Promise<IntelligentAssistantOutput> {
  return intelligentAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'intelligentAssistantPrompt',
  input: {schema: IntelligentAssistantInputSchema},
  output: {schema: IntelligentAssistantOutputSchema},
  prompt: `You are a chatbot designed to answer questions about the AgriConnect platform.

  Use the following information to answer user queries:
  - AgriConnect is a platform for farmers to connect with buyers.
  - Farmers can register and manage their profiles.
  - Farmers can showcase their products with images and prices.
  - Buyers can browse, search, and add products to their cart.
  - The platform supports order management and status updates.
  - Payments are simulated for secure transactions.

  Query: {{{query}}}`,
});

const intelligentAssistantFlow = ai.defineFlow(
  {
    name: 'intelligentAssistantFlow',
    inputSchema: IntelligentAssistantInputSchema,
    outputSchema: IntelligentAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

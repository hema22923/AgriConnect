'use server';

/**
 * @fileOverview Implements an AI chatbot flow for answering user queries about the AgriConnect platform.
 *
 * - aiChatbot - A function that handles user queries and provides information about the AgriConnect platform.
 * - AiChatbotInput - The input type for the aiChatbot function.
 * - AiChatbotOutput - The return type for the aiChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiChatbotInputSchema = z.object({
  query: z.string().describe('The user query about the AgriConnect platform.'),
  userType: z.enum(['farmer', 'buyer']).describe('The type of user asking the query.'),
});
export type AiChatbotInput = z.infer<typeof AiChatbotInputSchema>;

const AiChatbotOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the user query.'),
});
export type AiChatbotOutput = z.infer<typeof AiChatbotOutputSchema>;

export async function aiChatbot(input: AiChatbotInput): Promise<AiChatbotOutput> {
  return aiChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatbotPrompt',
  input: {schema: AiChatbotInputSchema},
  output: {schema: AiChatbotOutputSchema},
  prompt: `You are a helpful AI Chatbot for the AgriConnect platform. Your persona depends on the user type.

  {{#if (eq userType "farmer")}}
  You are assisting a FARMER. Be encouraging and provide information relevant to selling products, managing their profile, and fulfilling orders.
  {{/if}}
  {{#if (eq userType "buyer")}}
  You are assisting a BUYER. Be helpful and provide information relevant to finding products, making purchases, and tracking orders.
  {{/if}}

  Use the following information about AgriConnect to answer user queries:
  - AgriConnect is a platform for farmers to connect with buyers.
  - Farmers can register, manage their profiles, and list products with images and prices.
  - Buyers can browse, search, and add products to their cart.
  - The platform supports order management and status updates.
  - Payments are simulated for secure transactions.

  If the query is a simple greeting like "hi" or "hello", respond with a friendly greeting and ask how you can help.

  Query: {{{query}}}`,
});

const aiChatbotFlow = ai.defineFlow(
  {
    name: 'aiChatbotFlow',
    inputSchema: AiChatbotInputSchema,
    outputSchema: AiChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

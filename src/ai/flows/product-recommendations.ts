// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview AI-powered product recommendations flow.
 *
 * - getProductRecommendations - A function that returns product recommendations.
 * - ProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - ProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductRecommendationsInputSchema = z.object({
  pastOrders: z.string().describe('A list of past orders, comma separated.'),
  vehicleInformation: z
    .string()
    .describe('The vehicle information, including make, model, and year.'),
});

export type ProductRecommendationsInput = z.infer<
  typeof ProductRecommendationsInputSchema
>;

const ProductRecommendationsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of recommended products.'),
});

export type ProductRecommendationsOutput = z.infer<
  typeof ProductRecommendationsOutputSchema
>;

export async function getProductRecommendations(
  input: ProductRecommendationsInput
): Promise<ProductRecommendationsOutput> {
  return productRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {
    schema: ProductRecommendationsInputSchema,
  },
  output: {
    schema: ProductRecommendationsOutputSchema,
  },
  prompt: `You are an expert automotive product recommender.

Based on the customer's past orders and vehicle information, recommend products that they might be interested in.

Past Orders: {{{pastOrders}}}
Vehicle Information: {{{vehicleInformation}}}

Return a list of product recommendations.
`,
});

const productRecommendationsFlow = ai.defineFlow(
  {
    name: 'productRecommendationsFlow',
    inputSchema: ProductRecommendationsInputSchema,
    outputSchema: ProductRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await productRecommendationsPrompt(input);
    return output!;
  }
);

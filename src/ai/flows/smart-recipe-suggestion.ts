'use server';

/**
 * @fileOverview This file implements the Genkit flow for smart recipe suggestions.
 *
 * - suggestRecipes - A function that suggests recipes based on user input.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The output type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe('Any dietary restrictions the user has (e.g., vegetarian, gluten-free).'),
  availableIngredients: z
    .string()
    .describe('List of ingredients the user has available.'),
  healthGoals: z.string().describe('The user health goals (e.g., low-carb, high-protein).'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('A list of recipe suggestions based on the input criteria.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are a recipe suggestion AI. Given the following dietary restrictions, available ingredients, and health goals, suggest a list of recipes.

Dietary Restrictions: {{{dietaryRestrictions}}}
Available Ingredients: {{{availableIngredients}}}
Health Goals: {{{healthGoals}}}

Recipes:`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server'

import {
  suggestRecipes,
  type SuggestRecipesInput,
} from '@/ai/flows/smart-recipe-suggestion'

export async function getRecipeSuggestions(input: SuggestRecipesInput) {
  try {
    const result = await suggestRecipes(input)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error in getRecipeSuggestions:', error)
    return { success: false, error: 'Failed to get recipe suggestions from AI.' }
  }
}
